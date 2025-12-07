import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
// Asegúrate que la ruta al archivo client.model.ts sea correcta
import { ClientModel } from '../models/client.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  private http = inject(HttpClient);
  // URL de tu Backend
  private apiUrl = 'http://localhost:8080/api/clients';

  // 1. Obtener todos (READ)
  getClients(): Observable<ClientModel[]> {
    return this.http.get<ClientModel[]>(this.apiUrl);
  }

  // 2. Crear uno nuevo (CREATE)
  createClient(client: ClientModel): Observable<ClientModel> {
    return this.http.post<ClientModel>(this.apiUrl, client);
  }

  // 3. Eliminar (DELETE)
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 4. Obtener por ID (Para editar luego)
  getClientById(id: number): Observable<ClientModel> {
    return this.http.get<ClientModel>(`${this.apiUrl}/${id}`);
  }

  // 5. Actualizar (UPDATE) - ¡CORREGIDO!
  updateClient(id: number, client: ClientModel): Observable<ClientModel> {
    return this.http.put<ClientModel>(`${this.apiUrl}/${id}`, client);
  }
}
