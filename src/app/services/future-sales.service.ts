import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductModel } from '../models/product.model';

export interface FutureSalesResult {
  model_accuracy: number;
  model: string;
  future_ad_spend: number;
  predicted_units: number;
}

@Injectable({
  providedIn: 'root',
})
export class FutureSalesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  getProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${this.apiUrl}/products`);
  }

  predictSales(productId: number, adSpend: number): Observable<FutureSalesResult> {
    const body = { adSpend: adSpend };
    return this.http.post<FutureSalesResult>(`${this.apiUrl}/predict/sales/${productId}?adSpend=${adSpend}`, body);
  }
}
