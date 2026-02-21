import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RoleGuardCanMatch: CanMatchFn = (
  route: Route,
  segments: UrlSegment[],
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data?.['roles'] as string[];

  if (!expectedRoles || expectedRoles.length === 0) {
    return true;
  }

  const user = authService.user();

  if (!user) {
    router.navigateByUrl('/auth/login');
    return false;
  }

  const hasRole = expectedRoles.includes(user.rol);

  if (!hasRole) {
    router.navigateByUrl('/dashboard');
    return false;
  }

  return true;
};
