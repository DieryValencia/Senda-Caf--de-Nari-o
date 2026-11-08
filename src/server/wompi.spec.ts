import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import express from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { COFFEES } from '../app/coffee.data';
import { createWompiRouter } from './wompi';

const config = {
  publicKey: 'pub_test_example',
  integritySecret: 'test_integrity_example',
  redirectUrl: 'http://localhost:4000/',
};

const shipping = {
  name: 'Oskar Valencia',
  email: 'oskar@example.com',
  phone: '+57 300 123 4567',
  address: 'Calle 1 # 2-3',
  city: 'Pasto',
  department: 'Nariño',
};

describe('Wompi sandbox API', () => {
  let server: Server;
  let baseUrl: string;
  const fetchWompi = vi.fn<typeof fetch>();

  async function startServer(router = createWompiRouter({
    config,
    fetch: fetchWompi,
    createReference: () => 'SN-TEST-ORDER',
  })): Promise<void> {
    const app = express();
    app.use(express.json({ limit: '16kb' }));
    app.use('/api/wompi', router);
    server = createServer(app);

    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('The Wompi test server did not start on a TCP port.');
    }
    baseUrl = `http://127.0.0.1:${address.port}`;
  }

  beforeEach(async () => {
    fetchWompi.mockReset();
    await startServer();
  });

  afterEach(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it('calculates the charge from catalog prices and creates a signed hosted checkout URL', async () => {
    const response = await fetch(`${baseUrl}/api/wompi/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shipping,
        items: [{ coffeeId: COFFEES[0].id, quantity: 4, price: 1 }],
      }),
    });

    expect(response.status).toBe(201);
    const result = await response.json();
    expect(result.order.subtotal).toBe(COFFEES[0].price * 4);
    expect(result.order.shipping).toBe(0);
    expect(result.order.total).toBe(COFFEES[0].price * 4);
    expect(result.order.items[0].unitPrice).toBe(COFFEES[0].price);

    const checkout = new URL(result.checkoutUrl);
    expect(checkout.origin + checkout.pathname).toBe('https://checkout.wompi.co/p/');
    expect(checkout.searchParams.get('amount-in-cents')).toBe(String(result.order.total * 100));
    expect(checkout.searchParams.get('reference')).toBe('SN-TEST-ORDER');
    expect(checkout.searchParams.get('public-key')).toBe(config.publicKey);
    const expectedSignature = createHash('sha256')
      .update(
        `SN-TEST-ORDER${result.order.total * 100}COP${config.integritySecret}`,
      )
      .digest('hex');
    expect(checkout.searchParams.get('signature:integrity')).toBe(expectedSignature);
    expect(new URL(checkout.searchParams.get('redirect-url')!).searchParams.get('wompiReference'))
      .toBe('SN-TEST-ORDER');
  });

  it('charges shipping below the free-shipping threshold', async () => {
    const response = await fetch(`${baseUrl}/api/wompi/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shipping,
        items: [{ coffeeId: COFFEES[0].id, quantity: 1 }],
      }),
    });

    expect(response.status).toBe(201);
    const result = await response.json();
    expect(result.order.subtotal).toBe(COFFEES[0].price);
    expect(result.order.shipping).toBe(8_000);
    expect(result.order.total).toBe(COFFEES[0].price + 8_000);
  });

  it('rejects invalid shipping fields and quantities', async () => {
    const response = await fetch(`${baseUrl}/api/wompi/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shipping: { ...shipping, email: 'not-an-email' },
        items: [{ coffeeId: COFFEES[0].id, quantity: -1 }],
      }),
    });

    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe('invalid_order');
  });

  it('returns approved only after matching the Wompi transaction to the server-calculated order', async () => {
    const createResponse = await fetch(`${baseUrl}/api/wompi/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shipping,
        items: [{ coffeeId: COFFEES[0].id, quantity: 1 }],
      }),
    });
    const created = await createResponse.json();
    const totalInCents = created.order.total * 100;
    fetchWompi.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: {
            id: 'transaction-123',
            reference: created.order.reference,
            amount_in_cents: totalInCents,
            currency: 'COP',
            status: 'APPROVED',
          },
        }),
        { status: 200 },
      ),
    );

    const response = await fetch(
      `${baseUrl}/api/wompi/orders/${created.order.reference}/verify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: 'transaction-123' }),
      },
    );

    expect(response.status).toBe(200);
    expect((await response.json()).status).toBe('approved');
    expect(fetchWompi).toHaveBeenCalledOnce();
  });

  it('does not confirm a transaction whose amount does not match the order', async () => {
    const createResponse = await fetch(`${baseUrl}/api/wompi/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shipping,
        items: [{ coffeeId: COFFEES[0].id, quantity: 1 }],
      }),
    });
    const created = await createResponse.json();
    fetchWompi.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: {
            id: 'transaction-123',
            reference: created.order.reference,
            amount_in_cents: 1,
            currency: 'COP',
            status: 'APPROVED',
          },
        }),
        { status: 200 },
      ),
    );

    const response = await fetch(
      `${baseUrl}/api/wompi/orders/${created.order.reference}/verify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: 'transaction-123' }),
      },
    );

    expect(response.status).toBe(409);
    expect((await response.json()).code).toBe('transaction_mismatch');
  });

  it('explains when sandbox credentials are missing or not test credentials', async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    await startServer(createWompiRouter({ config: { ...config, publicKey: 'pub_live_example' } }));

    const response = await fetch(`${baseUrl}/api/wompi/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shipping,
        items: [{ coffeeId: COFFEES[0].id, quantity: 1 }],
      }),
    });

    expect(response.status).toBe(503);
    expect((await response.json()).code).toBe('wompi_not_configured');
  });
});
