import { Routes } from '@angular/router';
import { MainLayoutComponent } from './modules/shared/components/layout/main-layout/main-layout.component';
import { NotAuthenticatedGuardCanMatch } from './core/auth/guards/not-authenticated.guard';
import { AuthenticatedGuardCanMatch } from './core/auth/guards/authenticated.guard';
import { RoleGuardCanMatch } from './core/auth/guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./core/auth/auth.routes'),
    canMatch: [NotAuthenticatedGuardCanMatch],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canMatch: [AuthenticatedGuardCanMatch],
    children: [
      {
        path: 'dashboard',
        canMatch: [RoleGuardCanMatch],
        data: { roles: ['ROLE_ADMIN_TI'] },
        // loadComponent: () =>
        //   import('./modules/dashboard/dashboard.component').then(
        //     (m) => m.DashboardComponent,
        //   ),
      },
      {
        path: 'reports',
        canMatch: [RoleGuardCanMatch],
        data: { roles: ['ROLE_ADMIN_TI'] },
        // loadComponent: () =>
        //   import('./modules/reports/reports.component').then(
        //     (m) => m.ReportsComponent,
        //   ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
