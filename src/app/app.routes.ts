import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { ClientListComponent } from './features/clients/client-list/client-list';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
 { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },

  {
    path: 'clients',
    component: ClientListComponent,
    canActivate: [authGuard]
  }
];
