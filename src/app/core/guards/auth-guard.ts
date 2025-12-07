import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Verificamos si existe el token en la memoria
  const token = localStorage.getItem('auth_token');

  if (token) {
    return true; // ¡Pase usted!
  }

  // Si no hay token, fuera de aquí -> Al Login
  router.navigate(['/login']);
  return false;
};
