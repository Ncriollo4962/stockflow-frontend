import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { GlobalLoadingService } from '../../services/global-loading.service';

export function loadingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  const loading = inject(GlobalLoadingService);

  const skip =
    req.headers.get('X-Skip-Loading') === 'true' ||
    req.url.includes('/auth/refreshToken');

  if (skip) return next(req);

  loading.start();
  return next(req).pipe(finalize(() => loading.stop()));
}

