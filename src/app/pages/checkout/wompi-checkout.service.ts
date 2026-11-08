import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type {
  CreateWompiOrderRequest,
  WompiCheckoutResponse,
  WompiVerificationResponse,
} from '../../cart/purchase.models';

@Injectable({ providedIn: 'root' })
export class WompiCheckoutService {
  private readonly http = inject(HttpClient);

  createOrder(request: CreateWompiOrderRequest): Promise<WompiCheckoutResponse> {
    return firstValueFrom(
      this.http.post<WompiCheckoutResponse>('/api/wompi/orders', request),
    );
  }

  verifyTransaction(reference: string, transactionId: string): Promise<WompiVerificationResponse> {
    return firstValueFrom(
      this.http.post<WompiVerificationResponse>(
        `/api/wompi/orders/${encodeURIComponent(reference)}/verify`,
        { transactionId },
      ),
    );
  }
}
