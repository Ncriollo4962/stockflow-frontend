import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '../interfaces/auth-response';
import { RequestTokenRefresh } from '../interfaces/requestTokenRefresh';

type AuthStatus = 'checking' | 'authenticated' | 'no-authenticated';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _authStatus = signal<AuthStatus>('checking');
  private readonly _user = signal<Usuario | null>(null);
  private readonly _tokenAcces = signal<string | null>(
    localStorage.getItem('tokenAcces'),
  );
  private readonly _tokenRefresh = signal<string | null>(
    localStorage.getItem('tokenRefresh'),
  );
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.HOST_STOCKFLOW}/auth`;

  /* -------------------------------------------------------------------------- */
  /*                        PROCESO PARA LA AUTENTICACION                       */
  /* -------------------------------------------------------------------------- */

  checkStatusResource = rxResource({
    loader: () => this.checkAuthStatus(),
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) return 'authenticated';
    return 'no-authenticated';
  });

  user = computed<Usuario | null>(() => this._user());
  tokenAcces = computed<string | null>(() => this._tokenAcces());
  tokenRefresh = computed<string | null>(() => this._tokenRefresh());
  isAdmin = computed(() => this.user()?.roles.includes('admin') ?? false);

  login(credentials: { email: string; password: string }): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        map((resp) => this.handleAuthSucces(resp)),
        catchError((error) => this.handleAuthError(error)),
      );
  }

  checkAuthStatus(): Observable<boolean> {
    const tokenAcces = localStorage.getItem('tokenAcces');
    if (!tokenAcces) {
      this._authStatus.set('no-authenticated');
      return of(false);
    }

    return this.http.get<AuthResponse>(`${this.API_URL}/checkStatus`).pipe(
      map((resp) => this.handleAuthSucces(resp)),
      catchError(() => of(false)),
    );
  }

  refreshToken(): Observable<boolean> {
    const tokenRefresh = localStorage.getItem('tokenRefresh');
    if (!tokenRefresh) return of(false);

    const refreshToken: RequestTokenRefresh = {
      refreshToken: tokenRefresh,
    };

    return this.http
      .post<AuthResponse>(`${this.API_URL}/refreshToken`, refreshToken)
      .pipe(
        map((resp) => this.handleAuthSucces(resp)),
        catchError(() => of(false)),
      );
  }

  handleAuthSucces(resp: AuthResponse): boolean {
    this._user.set(resp.user);
    this._tokenAcces.set(resp.accessToken);
    localStorage.setItem('tokenAcces', resp.accessToken);

    if (resp.refreshToken) {
      this._tokenRefresh.set(resp.refreshToken);
      localStorage.setItem('tokenRefresh', resp.refreshToken);
    }

    this._authStatus.set('authenticated');
    return true;
  }

  handleAuthError(error: any): Observable<boolean> {
    this.logout();
    return of(false);
  }

  logout(): void {
    this._user.set(null);
    this._tokenAcces.set(null);
    this._tokenRefresh.set(null);
    this._authStatus.set('no-authenticated');
    localStorage.removeItem('tokenAcces');
    localStorage.removeItem('tokenRefresh');
  }
}
