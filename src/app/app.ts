import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service'; // Asegúrate de la ruta

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule], // <--- Importante
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  authService = inject(AuthService);
  router = inject(Router);

  // Método para el botón de Salir
  logout() {
    this.authService.logout();
  }

  // Truco simple: Si no estoy en el login, muestro el menú
  showMenu(): boolean {
    return this.router.url !== '/login';
  }
  // --- NUEVA FUNCIÓN ---
  isAdmin(): boolean {
    return localStorage.getItem('user_role') === 'ADMIN';
  }
  getUserName(): string {
    // Recuperamos el nombre o mostramos un texto por defecto
    return localStorage.getItem('user_name') || 'Usuario';
  }
}
