import { Routes } from '@angular/router';

export const inventarioModulesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./inventario-item/inventario-item.component').then(
        (m) => m.InventarioItemComponent,
      ),
  },
  {
    path: 'movimientos',
    loadChildren: () =>
      import('./movimiento-inventario/movimiento-inventario.routes').then(
        (m) => m.movimientoInventarioModulesRoutes,
      ),
  },
];
