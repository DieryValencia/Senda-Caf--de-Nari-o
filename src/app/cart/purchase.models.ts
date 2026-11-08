export interface ShippingDetails {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly address: string;
  readonly city: string;
  readonly department: string;
}

export type PaymentMethod = 'pse' | 'card' | 'nequi';
