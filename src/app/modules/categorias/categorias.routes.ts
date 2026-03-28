import { Routes } from '@angular/router';

export const categoriasModulesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./categorias.component').then((m) => m.CategoriasComponent),
  },
  {
    path: 'newCategoria',
    loadComponent: () =>
      import('./regedit-categoria/regedit-categoria.component').then(
        (m) => m.RegeditCategoriaComponent,
      ),
  },
  {
    path: 'editCategoria/:id',
    loadComponent: () =>
      import('./regedit-categoria/regedit-categoria.component').then(
        (m) => m.RegeditCategoriaComponent,
      ),
  },
];
