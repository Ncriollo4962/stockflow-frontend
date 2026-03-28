import { Routes } from '@angular/router';

export const productosModulesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./productos.component').then((m) => m.ProductosComponent),
  },
  {
    path: 'newProducto',
    loadComponent: () =>
      import('./regedit-producto/regedit-producto.component').then(
        (m) => m.RegeditProductoComponent,
      ),
  },
  {
    path: 'editProducto/:id',
    loadComponent: () =>
      import('./regedit-producto/regedit-producto.component').then(
        (m) => m.RegeditProductoComponent,
      ),
  },
];
