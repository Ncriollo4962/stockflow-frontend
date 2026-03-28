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
        loadChildren: () =>
          import('./inventario/inventario.routes').then(
            (m) => m.inventarioModulesRoutes,
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
        path: 'productos',
        loadChildren: () =>
          import('./productos/productos.routes').then(
            (m) => m.productosModulesRoutes,
          ),
      },
      {
        path: 'categorias',
        loadChildren: () =>
          import('./categorias/categorias.routes').then(
            (m) => m.categoriasModulesRoutes,
          ),
      },
      {
        path: 'ubicaciones',
        loadChildren: () =>
          import('./ubicaciones/ubicaciones.routes').then(
            (m) => m.ubicacionesModulesRoutes,
          ),
      },
      {
        path: 'proveedores',
        loadChildren: () =>
          import('./proveedores/proveedores.routes').then(
            (m) => m.proveedoresModulesRoutes,
          ),
      },
      {
        path: 'reportes',
        loadChildren: () =>
          import('./reportes/reportes.routes').then(
            (m) => m.reportesModulesRoutes,
          ),
      },
      {
        path: 'usuarios',
        canMatch: [RoleGuardCanMatch],
        data: { roles: ['ROLE_ADMIN_TI'] },
        loadChildren: () =>
          import('./usuarios/usuarios.routes').then(
            (m) => m.usuariosModulesRoutes,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
