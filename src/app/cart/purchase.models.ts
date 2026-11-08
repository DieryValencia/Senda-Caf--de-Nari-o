export interface ShippingDetails {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly address: string;
  readonly city: string;
  readonly department: string;
}

export interface PurchaseLineRequest {
  readonly coffeeId: number;
  readonly quantity: number;
}

export interface CreateWompiOrderRequest {
  readonly shipping: ShippingDetails;
  readonly items: readonly PurchaseLineRequest[];
}

export interface PurchaseLineSummary {
  readonly coffeeId: number;
  readonly name: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly imageUrl: string;
}

export interface PurchaseSummary {
  readonly reference: string;
  readonly items: readonly PurchaseLineSummary[];
  readonly subtotal: number;
  readonly shipping: number;
  readonly total: number;
}

export type PaymentStatus = 'pending' | 'approved' | 'declined' | 'cancelled' | 'error';

export interface WompiCheckoutResponse {
  readonly checkoutUrl: string;
  readonly order: PurchaseSummary;
}

export interface WompiVerificationResponse {
  readonly status: PaymentStatus;
  readonly transactionId: string;
  readonly order: PurchaseSummary;
}
