import { Component, inject, ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of, tap } from 'rxjs';

import { ProductModel } from '../../../models/product.model';
import { RiskResultModel } from '../../../models/risk-result.model';
import { PredictionService } from '../../../services/prediction.service';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-risk',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './risk.component.html',
  styleUrl: './risk.component.scss',
})
export class RiskComponent {
  private predictionService = inject(PredictionService);
  private cd = inject(ChangeDetectorRef); // Inyecta y asigna ChangeDetectorRef

  products$: Observable<ProductModel[]> = this.predictionService.getProducts();
  result$: Observable<RiskResultModel | null> = of(null);
  selectedProduct: ProductModel | null = null;
  analyzedProduct: ProductModel | null = null;
  loading: boolean = false;
  successRate: number = 0;

  onProductChange() {
    this.analyzedProduct = null;
    this.result$ = of(null);
    this.successRate = 0;
  }
  riskChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  riskChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Distribución de Escenarios (Montecarlo)' }
    }
  };

  ejecutarMontecarlo() {
    if (!this.selectedProduct || !this.selectedProduct.id) return;
    this.loading = true;
    this.analyzedProduct = { ...this.selectedProduct };

    this.result$ = this.predictionService.analyzeRisk(this.selectedProduct.id).pipe(
      tap((data) => {
        this.successRate = (data.profitable_scenarios / data.total_simulations) * 100;

        this.riskChartData = {
          labels: ['Escenarios con Ganancia', 'Escenarios con Pérdida'],
          datasets: [{
            data: [data.profitable_scenarios, data.loss_scenarios],
            backgroundColor: [
              'rgba(25, 135, 84, 0.6)',
              'rgba(220, 53, 69, 0.6)'
            ],
            borderColor: [
              'rgb(25, 135, 84)',
              'rgb(220, 53, 69)'
            ],
            borderWidth: 1
          }]
        };

        this.loading = false;
        this.cd.detectChanges();
      })
    );
  }

  descargarReporte() {
    if (!this.analyzedProduct || !this.analyzedProduct.id) return;

    this.predictionService.getRiskReport(this.analyzedProduct.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Riesgo_${this.analyzedProduct?.asin}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar reporte:', err);
        alert('No se pudo descargar el reporte.');
      }
    });
  }

  // --- Métodos de Estilo con Bootstrap ---
  getRiskMessage(): string {
    if (this.successRate >= 70) return 'Inversión Segura (Riesgo Bajo)';
    if (this.successRate >= 40) return 'Riesgo Moderado (Precaución)';
    return 'Alto Riesgo (No recomendado)';
  }

  getRiskCardClass(): string {
    if (this.successRate >= 70) return 'bg-success-subtle';
    if (this.successRate >= 40) return 'bg-warning-subtle';
    return 'bg-danger-subtle';
  }

  getRiskTextColor(): string {
    if (this.successRate >= 70) return 'text-success';
    if (this.successRate >= 40) return 'text-warning';
    return 'text-danger';
  }

  getRiskProgressClass(): string {
    if (this.successRate >= 70) return 'bg-success';
    if (this.successRate >= 40) return 'bg-warning';
    return 'bg-danger';
  }
}
