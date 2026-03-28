import { Routes } from '@angular/router';

export const proveedoresModulesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./proveedores.component').then((m) => m.ProveedoresComponent),
  },
  {
    path: 'newProveedor',
    loadComponent: () =>
      import('./regedit-proveedor/regedit-proveedor.component').then(
        (m) => m.RegeditProveedorComponent,
      ),
  },
  {
    path: 'editProveedor/:id',
    loadComponent: () =>
      import('./regedit-proveedor/regedit-proveedor.component').then(
        (m) => m.RegeditProveedorComponent,
      ),
  },
];
