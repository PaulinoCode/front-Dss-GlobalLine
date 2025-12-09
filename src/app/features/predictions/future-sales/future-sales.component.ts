import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of, tap, catchError } from 'rxjs';

import { ProductModel } from '../../../models/product.model';
import { FutureSalesService, FutureSalesResult } from '../../../services/future-sales.service';

@Component({
  selector: 'app-future-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './future-sales.component.html',
  styleUrl: './future-sales.component.scss',
})
export class FutureSalesComponent {
  private futureSalesService = inject(FutureSalesService);

  products$: Observable<ProductModel[]> = this.futureSalesService.getProducts();
  result$: Observable<FutureSalesResult | null> = of(null);
  selectedProduct: ProductModel | null = null;
  analyzedProduct: ProductModel | null = null;
  adSpend: number = 0;
  loading: boolean = false;
  errorMessage: string = '';

  onProductChange() {
    this.analyzedProduct = null;
    this.result$ = of(null);
    this.errorMessage = '';
  }

  onAdSpendChange() {
    this.analyzedProduct = null;
    this.result$ = of(null);
    this.errorMessage = '';
  }

  ejecutarPrediccionVentas() {
    if (!this.selectedProduct || !this.selectedProduct.id || this.adSpend <= 0) return;

    this.loading = true;
    this.errorMessage = '';
    this.analyzedProduct = { ...this.selectedProduct };

    this.result$ = this.futureSalesService.predictSales(this.selectedProduct.id, this.adSpend).pipe(
      tap(() => {
        this.loading = false;
      }),
      catchError((error) => {
        console.error('Error al obtener predicción de ventas:', error);
        this.loading = false;
        this.errorMessage = 'Error al predecir ventas. Verifica la conexión o que el producto tenga datos históricos suficientes.';
        this.analyzedProduct = null;
        return of(null);
      })
    );
  }

  // --- Métodos de Estilo con Bootstrap ---
  getAccuracyCardClass(accuracy: number): string {
    const accuracyPercent = accuracy * 100;
    if (accuracyPercent >= 90) return 'bg-success-subtle border-success';
    if (accuracyPercent >= 70) return 'bg-warning-subtle border-warning';
    return 'bg-danger-subtle border-danger';
  }

  getAccuracyTextColor(accuracy: number): string {
    const accuracyPercent = accuracy * 100;
    if (accuracyPercent >= 90) return 'text-success';
    if (accuracyPercent >= 70) return 'text-warning';
    return 'text-danger';
  }

  getAccuracyIcon(accuracy: number): string {
    const accuracyPercent = accuracy * 100;
    if (accuracyPercent >= 90) return '🎯'; // Muy preciso
    if (accuracyPercent >= 70) return '📊'; // Moderadamente preciso
    return '⚠️'; // Baja precisión
  }

  getAccuracyMessage(accuracy: number): string {
    const accuracyPercent = accuracy * 100;
    if (accuracyPercent >= 90) return 'Predicción Muy Confiable';
    if (accuracyPercent >= 70) return 'Predicción Moderada';
    return 'Predicción Poco Confiable';
  }

  getAccuracyPercentage(accuracy: number): number {
    return accuracy * 100;
  }

  getEstimatedRevenue(result: FutureSalesResult): number {
    return result.predicted_units * (this.analyzedProduct?.price || 0);
  }

  getEstimatedProfit(result: FutureSalesResult): number {
    if (!this.analyzedProduct) return 0;
    const revenue = this.getEstimatedRevenue(result);
    const costs = (result.predicted_units * this.analyzedProduct.cost) + result.future_ad_spend;
    return revenue - costs;
  }

  getROI(result: FutureSalesResult): number {
    const profit = this.getEstimatedProfit(result);
    return result.future_ad_spend > 0 ? (profit / result.future_ad_spend) * 100 : 0;
  }
}
