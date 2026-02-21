import { Routes } from '@angular/router';

export const modulesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./compras.component').then((m) => m.ComprasComponent),
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
];
