import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrdenCompra } from '../models/OrdenCompra';
import { ApiResponse } from '../utils/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class OrdenCompraService {
  private readonly apiUrl = `${environment.HOST_STOCKFLOW}/ordenescompra`;

  constructor(private readonly http: HttpClient) {}

  getOrdenCompras(): Observable<OrdenCompra[]> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/all`)
      .pipe(map((response) => response.data || []));
  }

  getOrdenCompraById(id: number): Observable<OrdenCompra> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  createOrdenCompra(ordenCompra: OrdenCompra): Observable<OrdenCompra> {
    return this.http
      .post<ApiResponse>(`${this.apiUrl}/register`, ordenCompra)
      .pipe(map((response) => response.data));
  }

  updateOrdenCompra(ordenCompra: OrdenCompra): Observable<OrdenCompra> {
    return this.http
      .put<ApiResponse>(`${this.apiUrl}/update`, ordenCompra)
      .pipe(map((response) => response.data));
  }

  deleteOrdenCompra(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/delete/${id}`)
      .pipe(map((response) => response.data));
  }

  deleteMultipleOrdenCompras(ids: number[]): Observable<void> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/delete-multiple`, { body: ids })
      .pipe(map((response) => response.data));
  }

  generateNumber(): Observable<number> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/generate-number`)
      .pipe(map((response) => response.data));
  }
}
