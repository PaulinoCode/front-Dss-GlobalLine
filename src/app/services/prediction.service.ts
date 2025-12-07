import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProductModel} from '../models/product.model';
import {RiskResultModel} from '../models/risk-result.model';

@Injectable({
  providedIn: 'root',
})
export class PredictionService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  getProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${this.apiUrl}/products`);
  }

  // RF-08: Llamada al endpoint de Montecarlo
  analyzeRisk(productId: number): Observable<RiskResultModel> {
    return this.http.get<RiskResultModel>(`${this.apiUrl}/predict/risk/${productId}`);
  }

  // Descargar reporte PDF
  getRiskReport(productId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reports/risk-pdf/${productId}`, {
      responseType: 'blob'
    });
  }
}
