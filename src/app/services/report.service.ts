import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/reports';

  // 1. Descargar PDF Global de Predicciones
  getPredictionPdf(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/prediction-pdf`, {
      responseType: 'blob'
    });
  }

  // 2. Descargar Excel de Respaldo (Métricas)
  getMetricsExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/metrics-excel`, {
      responseType: 'blob'
    });
  }
}
