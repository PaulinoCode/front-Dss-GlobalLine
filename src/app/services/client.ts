import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
// Asegúrate que la ruta al archivo clientM.ts sea correcta
import { ClientM } from '../models/clientM';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  private http = inject(HttpClient);
  // URL de tu Backend
  private apiUrl = 'http://localhost:8080/api/clients';

  // 1. Obtener todos (READ)
  getClients(): Observable<ClientM[]> {
    return this.http.get<ClientM[]>(this.apiUrl);
  }

  // 2. Crear uno nuevo (CREATE)
  createClient(client: ClientM): Observable<ClientM> {
    return this.http.post<ClientM>(this.apiUrl, client);
  }

  // 3. Eliminar (DELETE)
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 4. Obtener por ID (Para editar luego)
  getClientById(id: number): Observable<ClientM> {
    return this.http.get<ClientM>(`${this.apiUrl}/${id}`);
  }

  // 5. Actualizar (UPDATE) - ¡CORREGIDO!
  updateClient(id: number, client: ClientM): Observable<ClientM> {
    return this.http.put<ClientM>(`${this.apiUrl}/${id}`, client);
  }
}
