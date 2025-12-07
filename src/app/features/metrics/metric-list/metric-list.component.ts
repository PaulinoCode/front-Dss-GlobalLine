import {Component, inject, OnInit} from '@angular/core';
import {MetricService} from '../../../services/metric.service';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import {MetricModel} from '../../../models/metric.model';
import {CurrencyPipe, DatePipe, CommonModule} from '@angular/common'; // Import CommonModule
import {RouterLink} from '@angular/router';
import {ReportService} from '../../../services/report.service';

@Component({
  selector: 'app-metric-list',
  standalone: true, // <-- Added standalone: true
  imports: [
    CommonModule, // <-- Added CommonModule
    RouterLink,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './metric-list.component.html',
  styleUrl: './metric-list.component.scss',
})
export class MetricListComponent implements OnInit {

  private metricService = inject(MetricService);
  private refresh$ = new BehaviorSubject<void>(undefined);

  metrics$: Observable<MetricModel[]> = this.refresh$.pipe(
    switchMap(() => this.metricService.getAll())
  );

  isUploading = false;

  private reportService = inject(ReportService); // <--- Inyectar

  ngOnInit(): void {}

  delete(id: number) {
    if (confirm('¿Eliminar esta métrica?')) {
      this.metricService.delete(id).subscribe(() => this.refresh$.next());
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.metricService.uploadExcel(file).subscribe({
        next: (res) => {
          alert('✅ ' + (res.message || 'Carga exitosa'));
          this.isUploading = false;
          this.refresh$.next(); // Recargar la tabla automáticamente
        },
        error: (err) => {
          console.error(err);
          alert('❌ Error al subir archivo: ' + (err.error?.error || 'Desconocido'));
          this.isUploading = false;
        }
      });
    }
  }

  downloadExcel() {
    this.reportService.getMetricsExcel().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Respaldo_Metricas_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error(err);
        alert('Error al descargar el Excel.');
      }
    });
  }
}
