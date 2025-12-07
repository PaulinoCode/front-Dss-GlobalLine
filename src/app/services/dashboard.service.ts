import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/dashboard/admin';

  // 1. KPI Total (Tarjeta)
  getKpiTotal(): Observable<any> {
    return this.http.get(`${this.apiUrl}/kpi-total`);
  }

  // 2. Gráfica Línea (Ventas Mensuales)
  getMonthlyRevenue(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/monthly-revenue`);
  }

  // 3. Gráfica Pastel (Ventas por Cliente)
  getSalesByClient(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sales-by-client`);
  }

  // 4. Gráfica Barras (Top Productos)
  getTopProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-products`);
  }
}
