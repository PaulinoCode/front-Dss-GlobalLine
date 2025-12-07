import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Endpoint correcto
  private apiUrl = 'http://localhost:8080/api/users/me';

  login(email: string, pass: string) {
    // 1. ESTA ES LA LÍNEA NUEVA QUE ARREGLA EL ERROR 401
    // Borramos cualquier token viejo o corrupto antes de empezar
    localStorage.removeItem('auth_token');

    const credentials = btoa(email + ':' + pass);
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + credentials
    });

    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      tap(user => {
        // Si el login funciona, guardamos el nuevo token limpio
        localStorage.setItem('auth_token', credentials);
        localStorage.setItem('user_role', user.role);
        localStorage.setItem('user_name', user.name);
        console.log('LoginComponent correcto, usuario:', user);
      })
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
