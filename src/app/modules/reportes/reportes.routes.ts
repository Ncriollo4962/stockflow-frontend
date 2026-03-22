import { Routes } from '@angular/router';

export const reportesModulesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./reportes.component').then((m) => m.ReportesComponent),
    children: [
      {
        path: 'inventario-valorizado',
        loadComponent: () =>
          import('./inventario-valorizado/inventario-valorizado.component').then(
            (m) => m.InventarioValorizadoComponent,
          ),
      },
      {
        path: 'pareto-abc-ventas',
        loadComponent: () =>
          import('./pareto-abc-ventas/pareto-abc-ventas.component').then(
            (m) => m.ParetoAbcVentasComponent,
          ),
      },
    ],
  },
];
