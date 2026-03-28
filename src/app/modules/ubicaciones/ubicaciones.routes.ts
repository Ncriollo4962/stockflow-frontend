import { Routes } from '@angular/router';

export const ubicacionesModulesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ubicaciones.component').then((m) => m.UbicacionesComponent),
  },
  {
    path: 'newUbicacion',
    loadComponent: () =>
      import('./regedit-ubicacion/regedit-ubicacion.component').then(
        (m) => m.RegeditUbicacionComponent,
      ),
  },
  {
    path: 'editUbicacion/:id',
    loadComponent: () =>
      import('./regedit-ubicacion/regedit-ubicacion.component').then(
        (m) => m.RegeditUbicacionComponent,
      ),
  },
];
