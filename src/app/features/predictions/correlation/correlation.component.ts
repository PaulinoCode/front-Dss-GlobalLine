import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of, tap, catchError } from 'rxjs';

import { ProductModel } from '../../../models/product.model';
import { CorrelationService, CorrelationResult } from '../../../services/correlation.service';

@Component({
  selector: 'app-correlation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './correlation.component.html',
  styleUrl: './correlation.component.scss',
})
export class CorrelationComponent {
  private correlationService = inject(CorrelationService);

  products$: Observable<ProductModel[]> = this.correlationService.getProducts();
  result$: Observable<CorrelationResult | null> = of(null);
  selectedProduct: ProductModel | null = null;
  analyzedProduct: ProductModel | null = null;
  loading: boolean = false;
  errorMessage: string = '';

  onProductChange() {
    this.analyzedProduct = null;
    this.result$ = of(null);
    this.errorMessage = '';
  }

  ejecutarAnalisisCorrelacion() {
    if (!this.selectedProduct || !this.selectedProduct.id) return;

    this.loading = true;
    this.errorMessage = '';
    this.analyzedProduct = { ...this.selectedProduct };

    this.result$ = this.correlationService.getCorrelation(this.selectedProduct.id).pipe(
      tap(() => {
        this.loading = false;
      }),
      catchError((error) => {
        console.error('Error al obtener correlación:', error);
        this.loading = false;
        this.errorMessage = 'Error al calcular la correlación. Verifica la conexión o que el producto tenga datos suficientes.';
        this.analyzedProduct = null;
        return of(null);
      })
    );
  }

  // --- Métodos de Estilo con Bootstrap ---
  getCorrelationCardClass(coefficient: number): string {
    if (coefficient >= 0.7) return 'bg-success-subtle border-success';
    if (coefficient >= 0.3) return 'bg-warning-subtle border-warning';
    if (coefficient > -0.3) return 'bg-danger-subtle border-danger';
    return 'bg-dark-subtle border-dark';
  }

  getCorrelationTextColor(coefficient: number): string {
    if (coefficient >= 0.7) return 'text-success';
    if (coefficient >= 0.3) return 'text-warning';
    if (coefficient > -0.3) return 'text-danger';
    return 'text-dark';
  }

  getCorrelationIcon(coefficient: number): string {
    if (coefficient >= 0.7) return '🔥'; // Altamente eficiente
    if (coefficient >= 0.3) return '📊'; // Moderado
    if (coefficient > -0.3) return '⚠️'; // Desperdiciado
    return '❌'; // Inverso
  }

  getCorrelationPercentage(coefficient: number): number {
    return Math.abs(coefficient) * 100;
  }
}
