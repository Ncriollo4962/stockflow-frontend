import { Routes } from '@angular/router';

export const ventasModulesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ventas.component').then((m) => m.VentasComponent),
  },
  {
    path: 'newOrdenVenta',
    loadComponent: () =>
      import('./regedit-orden-venta/regedit-orden-venta.component').then(
        (m) => m.RegeditOrdenVentaComponent,
      ),
  },
  {
    path: 'editOrdenVenta/:id',
    loadComponent: () =>
      import('./regedit-orden-venta/regedit-orden-venta.component').then(
        (m) => m.RegeditOrdenVentaComponent,
      ),
  },
];
