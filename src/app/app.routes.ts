import { Routes } from '@angular/router';
import { AuthenticatedGuardCanMatch } from './core/auth/guards/authenticated.guard';
import { NotAuthenticatedGuardCanMatch } from './core/auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./core/auth/auth.routes'),
    canMatch: [NotAuthenticatedGuardCanMatch],
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/modules.routes').then((m) => m.modulesRoutes),
    canMatch: [AuthenticatedGuardCanMatch],
  },
  { path: '**', redirectTo: '' },
];
