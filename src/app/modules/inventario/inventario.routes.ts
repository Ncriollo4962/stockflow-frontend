import { Routes } from '@angular/router';

export const modulesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./inventario.component').then((m) => m.InventarioComponent),
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
];
