import { Routes } from '@angular/router';
export const modulesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./usuarios.component').then((m) => m.UsuariosComponent),
  },
];
