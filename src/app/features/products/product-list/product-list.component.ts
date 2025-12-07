import {Component, inject, OnInit} from '@angular/core';
import {ProductService} from '../../../services/product.service';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import {ProductModel} from '../../../models/product.model';
import {RouterLink} from '@angular/router';
import {CurrencyPipe, CommonModule} from '@angular/common';
import {ReportService} from '../../../services/report.service'; // Import CommonModule

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {

  private productService = inject(ProductService);
  private refresh$ = new BehaviorSubject<void>(undefined);
  private reportService = inject(ReportService);

  products$: Observable<ProductModel[]> = this.refresh$.pipe(
    switchMap(() => this.productService.getAll())
  );

  ngOnInit(): void {}

  delete(id: number) {
    if (confirm('¿Borrar este producto?')) {
      this.productService.delete(id).subscribe({
        next: () => this.refresh$.next(),
        error: (err) => {
          console.error('Error al eliminar el producto:', err);
            alert('Error al borrar: ' + err.message)
        }
      });
    }
  }

  downloadPredictionReport() {
    this.reportService.getPredictionPdf().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Reporte_Global_Predicciones.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error(err);
        alert('Error al generar el PDF.');
      }
    });
  }
}
