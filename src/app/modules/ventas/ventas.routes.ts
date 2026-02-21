import { Routes } from '@angular/router';

export const modulesRoutes: Routes = [
  {
    path: 'ventas',
    loadComponent: () =>
      import('./ventas.component').then((m) => m.VentasComponent),
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
];
