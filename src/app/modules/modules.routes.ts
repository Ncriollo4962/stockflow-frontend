import { Routes } from '@angular/router';
import { RoleGuardCanMatch } from '../core/auth/guards/role.guard';
import { MainLayoutComponent } from './shared/components/layout/main-layout/main-layout.component';

export const modulesRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'inventario',
        loadComponent: () =>
          import('./inventario/inventario.component').then(
            (m) => m.InventarioComponent,
          ),
      },
      {
        path: 'compras',
        loadChildren: () =>
          import('./compras/compras.routes').then(
            (m) => m.comprasModulesRoutes,
          ),
      },
      {
        path: 'ventas',
        loadChildren: () =>
          import('./ventas/ventas.routes').then((m) => m.ventasModulesRoutes),
      },
      {
        path: 'usuarios',
        canMatch: [RoleGuardCanMatch],
        data: { roles: ['ROLE_ADMIN_TI'] },
        loadComponent: () =>
          import('./usuarios/usuarios.component').then(
            (m) => m.UsuariosComponent,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
