import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ClientListComponent } from './features/clients/client-list/client-list.component';
import { authGuard } from './core/guards/auth-guard';
import {RiskComponent} from './features/predictions/risk/risk.component';
import {CorrelationComponent} from './features/predictions/correlation/correlation.component';
import {FutureSalesComponent} from './features/predictions/future-sales/future-sales.component';
import {ClientFormComponent} from './features/clients/client-form/client-form.component';
import {ProductListComponent} from './features/products/product-list/product-list.component';
import {ProductFormComponent} from './features/products/product-form/product-form.component';
import {MetricFormComponent} from './features/metrics/metric-form/metric-form.component';
import {MetricListComponent} from './features/metrics/metric-list/metric-list.component';
import {UserListComponent} from './features/users/user-list/user-list.component';
import {UserFormComponent} from './features/users/user-form/user-form.component';
import {DashboardComponent} from './features/dashboard/dashboard.component';
import {roleGuard} from './core/guards/role-guard';

export const routes: Routes = [
 { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  // Clientes
  {path: 'clients', component: ClientListComponent, canActivate: [authGuard]},
  {path: 'clients/new', component: ClientFormComponent, canActivate: [authGuard]},
  {path: 'clients/edit/:id', component: ClientFormComponent, canActivate: [authGuard]},

  // Productos
  { path: 'products', component: ProductListComponent, canActivate: [authGuard] },
  { path: 'products/new', component: ProductFormComponent, canActivate: [authGuard] },
  { path: 'products/edit/:id', component: ProductFormComponent, canActivate: [authGuard] },

  // Métricas
  { path: 'metrics', component: MetricListComponent, canActivate: [authGuard] },
  { path: 'metrics/new', component: MetricFormComponent, canActivate: [authGuard] },
  { path: 'metrics/edit/:id', component: MetricFormComponent, canActivate: [authGuard] },

  // USUARIOS (Solo ADMIN)
  {path: 'users', component: UserListComponent, canActivate: [authGuard, roleGuard], data: { role: 'ADMIN' }},
  {path: 'users/new', component: UserFormComponent, canActivate: [authGuard, roleGuard], data: { role: 'ADMIN' }},
  {path: 'users/edit/:id', component: UserFormComponent, canActivate: [authGuard, roleGuard], data: { role: 'ADMIN' }},

  // DASHBOARD (Solo ADMIN)
  {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard, roleGuard], data: { role: 'ADMIN' }},


  // Riesgo (Montecarlo)
  {
    path: 'risk',
    component: RiskComponent,
    canActivate: [authGuard]
  },

  // Correlación
  {
    path: 'correlation',
    component: CorrelationComponent,
    canActivate: [authGuard]
  },

  // Predicción de Ventas Futuras
  {
    path: 'future-sales',
    component: FutureSalesComponent,
    canActivate: [authGuard]
  }
];
