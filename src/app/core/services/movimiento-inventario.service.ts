import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovimientoInventario } from '../models/MovimientoInventario';
import { ApiResponse } from '../utils/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class MovimientoInventarioService {
  private readonly apiUrl = `${environment.HOST_STOCKFLOW}/movimientos`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<MovimientoInventario[]> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/all`)
      .pipe(map((response) => response.data || []));
  }

  getById(id: number): Observable<MovimientoInventario> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  create(movimiento: MovimientoInventario): Observable<MovimientoInventario> {
    return this.http
      .post<ApiResponse>(`${this.apiUrl}/register`, movimiento)
      .pipe(map((response) => response.data));
  }

  update(movimiento: MovimientoInventario): Observable<MovimientoInventario> {
    return this.http
      .put<ApiResponse>(`${this.apiUrl}/update`, movimiento)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/delete/${id}`)
      .pipe(map(() => void 0));
  }

  deleteMultiple(ids: number[]): Observable<void> {
    return this.http
      .request<ApiResponse>('delete', `${this.apiUrl}/delete-multiple`, {
        body: ids,
      })
      .pipe(map(() => void 0));
  }
}
