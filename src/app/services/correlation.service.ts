import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductModel } from '../models/product.model';

export interface CorrelationResult {
  interpretation: string;
  correlation_coefficient: number;
}

@Injectable({
  providedIn: 'root',
})
export class CorrelationService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  getProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${this.apiUrl}/products`);
  }

  getCorrelation(productId: number): Observable<CorrelationResult> {
    return this.http.get<CorrelationResult>(`${this.apiUrl}/predict/correlation/${productId}`);
  }
}
