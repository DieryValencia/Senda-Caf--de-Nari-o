import { createHash, randomUUID } from 'node:crypto';
import { Router } from 'express';
import { COFFEES } from '../app/coffee.data';
import type {
  CreateWompiOrderRequest,
  PaymentStatus,
  PurchaseLineRequest,
  PurchaseSummary,
  ShippingDetails,
  WompiVerificationResponse,
} from '../app/cart/purchase.models';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../app/cart/cart.store';

const CURRENCY = 'COP';
const CHECKOUT_URL = 'https://checkout.wompi.co/p/';
const SANDBOX_API_URL = 'https://sandbox.wompi.co/v1';
const ORDER_TTL_MS = 30 * 60 * 1000;

export interface WompiConfig {
  readonly publicKey: string;
  readonly integritySecret: string;
  readonly redirectUrl: string;
}

interface StoredOrder {
  readonly summary: PurchaseSummary;
  readonly shipping: ShippingDetails;
  readonly amountInCents: number;
  readonly expiresAt: number;
}

interface WompiTransaction {
  readonly id: string;
  readonly reference: string;
  readonly amount_in_cents: number;
  readonly currency: string;
  readonly status: string;
}

export interface WompiRouterOptions {
  readonly config?: Partial<WompiConfig>;
  readonly fetch?: typeof fetch;
  readonly now?: () => number;
  readonly createReference?: () => string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const text = value.trim();
  return text.length > 0 && text.length <= maxLength ? text : null;
}

function parseShipping(value: unknown): ShippingDetails | null {
  if (!isRecord(value)) {
    return null;
  }

  const name = requiredText(value['name'], 120);
  const email = requiredText(value['email'], 254);
  const phone = requiredText(value['phone'], 30);
  const address = requiredText(value['address'], 180);
  const city = requiredText(value['city'], 100);
  const department = requiredText(value['department'], 100);

  if (
    !name ||
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !phone ||
    !/^[+\d\s()-]{7,30}$/.test(phone) ||
    !address ||
    !city ||
    !department
  ) {
    return null;
  }

  return { name, email, phone, address, city, department };
}

function parseItems(value: unknown): PurchaseLineRequest[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > COFFEES.length) {
    return null;
  }

  const items: PurchaseLineRequest[] = [];
  for (const entry of value) {
    if (!isRecord(entry)) {
      return null;
    }

    const coffeeId = entry['coffeeId'];
    const quantity = entry['quantity'];
    if (
      typeof coffeeId !== 'number' ||
      typeof quantity !== 'number' ||
      !Number.isSafeInteger(coffeeId) ||
      !Number.isSafeInteger(quantity)
    ) {
      return null;
    }

    items.push({ coffeeId, quantity });
  }

  return items;
}

function calculateOrder(
  reference: string,
  request: CreateWompiOrderRequest,
): PurchaseSummary | null {
  if (
    request.items.length === 0 ||
    request.items.length > COFFEES.length
  ) {
    return null;
  }

  const seenCoffeeIds = new Set<number>();
  const items: PurchaseSummary['items'][number][] = [];

  for (const line of request.items) {
    if (
      !Number.isSafeInteger(line.coffeeId) ||
      !Number.isSafeInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > 99 ||
      seenCoffeeIds.has(line.coffeeId)
    ) {
      return null;
    }

    const coffee = COFFEES.find((entry) => entry.id === line.coffeeId);
    if (!coffee) {
      return null;
    }

    seenCoffeeIds.add(line.coffeeId);
    items.push({
      coffeeId: coffee.id,
      name: coffee.name,
      quantity: line.quantity,
      unitPrice: coffee.price,
      imageUrl: coffee.cardImage,
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  if (!Number.isSafeInteger(subtotal)) {
    return null;
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { reference, items, subtotal, shipping, total: subtotal + shipping };
}

function readConfig(overrides?: Partial<WompiConfig>): WompiConfig | null {
  const publicKey = overrides?.publicKey ?? process.env['WOMPI_PUBLIC_KEY'];
  const integritySecret = overrides?.integritySecret ?? process.env['WOMPI_INTEGRITY_SECRET'];
  const redirectUrl = overrides?.redirectUrl ?? process.env['WOMPI_REDIRECT_URL'];

  if (
    !publicKey?.startsWith('pub_test_') ||
    !integritySecret?.startsWith('test_integrity_') ||
    !redirectUrl
  ) {
    return null;
  }

  try {
    const url = new URL(redirectUrl);
    if (
      url.protocol !== 'https:' &&
      !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))
    ) {
      return null;
    }
  } catch {
    return null;
  }

  return { publicKey, integritySecret, redirectUrl };
}

export function createIntegritySignature(
  reference: string,
  amountInCents: number,
  integritySecret: string,
): string {
  return createHash('sha256')
    .update(`${reference}${amountInCents}${CURRENCY}${integritySecret}`)
    .digest('hex');
}

function mapTransactionStatus(status: string): PaymentStatus | null {
  switch (status.toUpperCase()) {
    case 'APPROVED':
      return 'approved';
    case 'PENDING':
      return 'pending';
    case 'DECLINED':
      return 'declined';
    case 'ERROR':
      return 'error';
    case 'CANCELED':
    case 'CANCELLED':
    case 'VOIDED':
    case 'EXPIRED':
      return 'cancelled';
    default:
      return null;
  }
}

function isWompiTransaction(value: unknown): value is WompiTransaction {
  return (
    isRecord(value) &&
    typeof value['id'] === 'string' &&
    typeof value['reference'] === 'string' &&
    Number.isSafeInteger(value['amount_in_cents']) &&
    typeof value['currency'] === 'string' &&
    typeof value['status'] === 'string'
  );
}

export function createWompiRouter(options: WompiRouterOptions = {}): Router {
  const router = Router();
  const pendingOrders = new Map<string, StoredOrder>();
  const fetchWompi = options.fetch ?? globalThis.fetch;
  const now = options.now ?? Date.now;
  const createReference =
    options.createReference ??
    (() => `SN-${randomUUID().replaceAll('-', '').slice(0, 20).toUpperCase()}`);

  function removeExpiredOrders(): void {
    const currentTime = now();
    for (const [reference, order] of pendingOrders) {
      if (order.expiresAt <= currentTime) {
        pendingOrders.delete(reference);
      }
    }
  }

  router.post('/orders', (request, response) => {
    const config = readConfig(options.config);
    if (!config) {
      response.status(503).json({
        code: 'wompi_not_configured',
        message: 'El checkout sandbox no está configurado en el servidor.',
      });
      return;
    }

    if (!isRecord(request.body)) {
      response.status(400).json({ code: 'invalid_order', message: 'Revisa los datos del pedido.' });
      return;
    }

    const shipping = parseShipping(request.body['shipping']);
    const items = parseItems(request.body['items']);
    if (!shipping || !items) {
      response.status(400).json({
        code: 'invalid_order',
        message: 'Completa los datos de envío y revisa los productos de la bolsa.',
      });
      return;
    }

    const requestBody: CreateWompiOrderRequest = { shipping, items };
    const reference = createReference();
    const summary = calculateOrder(reference, requestBody);
    if (!summary) {
      response.status(400).json({
        code: 'invalid_order',
        message: 'La bolsa contiene productos o cantidades no válidas.',
      });
      return;
    }

    const amountInCents = summary.total * 100;
    if (!Number.isSafeInteger(amountInCents)) {
      response.status(400).json({ code: 'invalid_amount', message: 'El total del pedido no es válido.' });
      return;
    }

    removeExpiredOrders();
    pendingOrders.set(reference, {
      summary,
      shipping,
      amountInCents,
      expiresAt: now() + ORDER_TTL_MS,
    });

    const redirectUrl = new URL(config.redirectUrl);
    redirectUrl.searchParams.set('wompiReference', reference);
    const checkoutUrl = new URL(CHECKOUT_URL);
    checkoutUrl.searchParams.set('public-key', config.publicKey);
    checkoutUrl.searchParams.set('currency', CURRENCY);
    checkoutUrl.searchParams.set('amount-in-cents', String(amountInCents));
    checkoutUrl.searchParams.set('reference', reference);
    checkoutUrl.searchParams.set(
      'signature:integrity',
      createIntegritySignature(reference, amountInCents, config.integritySecret),
    );
    checkoutUrl.searchParams.set('redirect-url', redirectUrl.toString());

    response.status(201).json({ checkoutUrl: checkoutUrl.toString(), order: summary });
  });

  router.post('/orders/:reference/verify', async (request, response) => {
    const config = readConfig(options.config);
    if (!config) {
      response.status(503).json({
        code: 'wompi_not_configured',
        message: 'No se puede verificar el pago: falta configuración sandbox del servidor.',
      });
      return;
    }

    removeExpiredOrders();
    const reference = requiredText(request.params['reference'], 64);
    const transactionId = isRecord(request.body)
      ? requiredText(request.body['transactionId'], 128)
      : null;
    const order = reference ? pendingOrders.get(reference) : undefined;

    if (!reference || !transactionId || !order) {
      response.status(404).json({
        code: 'order_not_found',
        message: 'No encontramos un pedido pendiente para verificar.',
      });
      return;
    }

    let apiResponse: Response;
    try {
      apiResponse = await fetchWompi(
        `${SANDBOX_API_URL}/transactions/${encodeURIComponent(transactionId)}`,
        { headers: { Accept: 'application/json' } },
      );
    } catch (error) {
      console.error('Wompi sandbox verification request failed.', error);
      response.status(502).json({
        code: 'wompi_unavailable',
        message: 'No pudimos consultar el estado del pago con Wompi. Intenta de nuevo.',
      });
      return;
    }

    if (!apiResponse.ok) {
      response.status(502).json({
        code: 'wompi_verification_failed',
        message: 'Wompi no pudo verificar la transacción. Intenta de nuevo.',
      });
      return;
    }

    let responseBody: unknown;
    try {
      responseBody = await apiResponse.json();
    } catch {
      response.status(502).json({
        code: 'invalid_wompi_response',
        message: 'Wompi devolvió una respuesta que no pudimos interpretar.',
      });
      return;
    }

    const transaction =
      isRecord(responseBody) && isWompiTransaction(responseBody['data'])
        ? responseBody['data']
        : null;
    if (!transaction) {
      response.status(502).json({
        code: 'invalid_wompi_response',
        message: 'Wompi devolvió datos de transacción incompletos.',
      });
      return;
    }

    if (
      transaction.reference !== reference ||
      transaction.id !== transactionId ||
      transaction.amount_in_cents !== order.amountInCents ||
      transaction.currency !== CURRENCY
    ) {
      response.status(409).json({
        code: 'transaction_mismatch',
        message: 'La transacción consultada no coincide con el pedido.',
      });
      return;
    }

    const status = mapTransactionStatus(transaction.status);
    if (!status) {
      response.status(502).json({
        code: 'unknown_wompi_status',
        message: 'Wompi devolvió un estado de pago no reconocido.',
      });
      return;
    }

    const result: WompiVerificationResponse = {
      status,
      transactionId: transaction.id,
      order: order.summary,
    };
    response.json(result);
  });

  return router;
}
