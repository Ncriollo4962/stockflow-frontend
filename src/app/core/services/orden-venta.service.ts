import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrdenVenta } from '../models/OrdenVenta';
import { ApiResponse } from '../utils/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class OrdenVentaService {
  private readonly apiUrl = `${environment.HOST_STOCKFLOW}/ordenesventa`;

  constructor(private readonly http: HttpClient) {}

  getOrdenVentas(): Observable<OrdenVenta[]> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/all`)
      .pipe(map((response) => response.data || []));
  }

  getOrdenVentaById(id: number): Observable<OrdenVenta> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  createOrdenVenta(ordenVenta: OrdenVenta): Observable<OrdenVenta> {
    return this.http
      .post<ApiResponse>(`${this.apiUrl}/register`, ordenVenta)
      .pipe(map((response) => response.data));
  }

  updateOrdenVenta(ordenVenta: OrdenVenta): Observable<OrdenVenta> {
    return this.http
      .put<ApiResponse>(`${this.apiUrl}/update`, ordenVenta)
      .pipe(map((response) => response.data));
  }

  deleteOrdenVenta(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/delete/${id}`)
      .pipe(map((response) => response.data));
  }

  deleteMultipleOrdenVentas(ids: number[]): Observable<void> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/delete-multiple`, { body: ids })
      .pipe(map((response) => response.data));
  }

  generateNumber(): Observable<string> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/generate-number`)
      .pipe(map((response) => response.data));
  }
}
