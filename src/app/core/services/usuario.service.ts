import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../utils/ApiResponse';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly apiUrl = `${environment.HOST_STOCKFLOW}/usuarios`;
  constructor(private readonly http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/all`)
      .pipe(map((response) => response.data || []));
  }

  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data || new Usuario()),
      catchError(() =>
        this.http
          .get<ApiResponse>(`${this.apiUrl}/id/${id}`)
          .pipe(map((response) => response.data || new Usuario())),
      ),
    );
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http
      .post<ApiResponse>(`${this.apiUrl}/register`, usuario)
      .pipe(map((response) => response.data || new Usuario()));
  }

  updateUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http
      .put<ApiResponse>(`${this.apiUrl}/update`, usuario)
      .pipe(map((response) => response.data || new Usuario()));
  }
  deleteUsuario(id: number): Observable<Usuario> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/delete/${id}`)
      .pipe(map((response) => response.data || new Usuario()));
  }
  deleteMultipleUsuarios(ids: number[]): Observable<Usuario[]> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/delete-multiple`, {
        body: ids,
      })
      .pipe(map((response) => response.data || []));
  }
}
