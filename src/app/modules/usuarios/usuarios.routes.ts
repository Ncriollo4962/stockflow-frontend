import { Routes } from '@angular/router';
export const usuariosModulesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./usuarios.component').then((m) => m.UsuariosComponent),
  },
  {
    path: 'newUsuario',
    loadComponent: () =>
      import('./regedit-usuario/regedit-usuario.component').then(
        (m) => m.RegeditUsuarioComponent,
      ),
  },
  {
    path: 'editUsuario/:id',
    loadComponent: () =>
      import('./regedit-usuario/regedit-usuario.component').then(
        (m) => m.RegeditUsuarioComponent,
      ),
  },
];
