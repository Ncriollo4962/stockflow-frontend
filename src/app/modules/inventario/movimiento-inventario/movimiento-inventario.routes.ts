import { Routes } from '@angular/router';

export const movimientoInventarioModulesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./movimiento-inventario.component').then(
        (m) => m.MovimientoInventarioComponent,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./regedit-movimiento-inventario/regedit-movimiento-inventario.component').then(
        (m) => m.RegeditMovimientoInventarioComponent,
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./regedit-movimiento-inventario/regedit-movimiento-inventario.component').then(
        (m) => m.RegeditMovimientoInventarioComponent,
      ),
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
];
