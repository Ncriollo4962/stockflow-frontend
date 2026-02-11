import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  const authService = inject(AuthService);
  const token = authService.tokenAcces();

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        return handleRefreshToken(authReq, next, authService);
      }
      return throwError(() => error);
    }),
  );

  function handleRefreshToken(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
    authService: AuthService,
  ): Observable<any> {
    return authService.refreshToken().pipe(
      switchMap((isSuccess) => {
        if (isSuccess) {
          const newToken = authService.tokenAcces();
          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` },
          });
          return next(retryReq);
        }

        authService.logout();
        return throwError(
          () => new Error('Sesión expirada - Refresh Token inválido'),
        );
      }),
      catchError((err) => {
        authService.logout();
        return throwError(() => err);
      }),
    );
  }
}
