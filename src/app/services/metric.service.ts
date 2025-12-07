import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MetricModel} from '../models/metric.model';

@Injectable({
  providedIn: 'root',
})
export class MetricService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/metrics';

  // CRUD ESTÁNDAR
  getAll(): Observable<MetricModel[]> {
    return this.http.get<MetricModel[]>(this.apiUrl);
  }

  getById(id: number): Observable<MetricModel> {
    return this.http.get<MetricModel>(`${this.apiUrl}/${id}`);
  }

  create(metric: MetricModel): Observable<MetricModel> {
    return this.http.post<MetricModel>(this.apiUrl, metric);
  }

  update(id: number, metric: MetricModel): Observable<MetricModel> {
    return this.http.put<MetricModel>(`${this.apiUrl}/${id}`, metric);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // --- CARGA MASIVA (EXCEL) ---
  uploadExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getByProduct(productId: number): Observable<MetricModel[]> {
    return this.http.get<MetricModel[]>(`${this.apiUrl}/product/${productId}`);
  }
}
