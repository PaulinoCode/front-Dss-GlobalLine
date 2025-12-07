import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // 1. Obtener el rol del usuario desde el localStorage (donde lo guardamos al hacer login)
  const userRole = localStorage.getItem('user_role'); // 'ADMIN' o 'MANAGER'

  // 2. Obtener el rol requerido para esta ruta (lo definiremos en app.routes.ts)
  const requiredRole = route.data['role'];

  // 3. Verificar si tiene permiso
  if (userRole === requiredRole) {
    return true; // ¡Pase usted!
  }

  // 4. Si no tiene permiso, lo mandamos a una ruta segura (ej. Clientes)
  alert('⛔ Acceso Denegado: No tienes permisos de Administrador.');
  router.navigate(['/clients']);
  return false;
};
