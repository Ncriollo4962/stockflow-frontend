import { Routes } from '@angular/router';

export const comprasModulesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./compras.component').then((m) => m.ComprasComponent),
  },
  {
    path: 'newOrdenCompra',
    loadComponent: () =>
      import('./regedit-orden-compra/regedit-orden-compra.component').then(
        (m) => m.RegeditOrdenCompraComponent,
      ),
  },
  {
    path: 'editOrdenCompra/:id',
    loadComponent: () =>
      import('./regedit-orden-compra/regedit-orden-compra.component').then(
        (m) => m.RegeditOrdenCompraComponent,
      ),
  },
];
