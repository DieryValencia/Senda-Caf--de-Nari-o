import { Pipe, PipeTransform } from '@angular/core';

const priceFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

@Pipe({ name: 'coffeePrice' })
export class CoffeePricePipe implements PipeTransform {
  transform(value: number): string {
    return priceFormatter.format(value);
  }
}
