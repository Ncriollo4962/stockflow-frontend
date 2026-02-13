import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RoleGuardCanMatch: CanMatchFn = (
  route: Route,
  segments: UrlSegment[],
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('RoleGuardCanMatch', route, segments);

  // Obtenemos los roles permitidos desde la data de la ruta
  const expectedRoles = route.data?.['roles'] as string[];
  console.log('expectedRoles', expectedRoles);

  // Si no se definieron roles, permitimos el paso (o bloqueamos, según política)
  if (!expectedRoles || expectedRoles.length === 0) {
    return true;
  }

  const user = authService.user();

  console.log('user', user);

  // Si no hay usuario, mandamos al login
  if (!user) {
    router.navigateByUrl('/auth/login');
    return false;
  }

  // Verificamos si el usuario tiene alguno de los roles requeridos
  // Asumimos que user.role es un string, ej: 'ADMIN'
  const hasRole = expectedRoles.includes(user.rol);
  console.log('hasRole', hasRole);

  if (!hasRole) {
    // Si no tiene permiso, redirigimos al dashboard o a una página de "Forbidden"
    router.navigateByUrl('/dashboard');
    return false;
  }

  return true;
};
