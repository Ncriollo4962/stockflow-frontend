import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Producto } from '../models/Producto';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../utils/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private readonly apiUrl = `${environment.HOST_STOCKFLOW}/productos`;

  constructor(private readonly http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/all`)
      .pipe(map((response) => response.data || []));
  }

  getProductoById(id: number): Observable<Producto> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  createProducto(producto: Producto): Observable<Producto> {
    return this.http
      .post<ApiResponse>(`${this.apiUrl}/register`, producto)
      .pipe(map((response) => response.data));
  }

  updateProducto(producto: Producto): Observable<Producto> {
    return this.http
      .put<ApiResponse>(`${this.apiUrl}/update`, producto)
      .pipe(map((response) => response.data));
  }

  deleteProducto(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/delete/${id}`)
      .pipe(map(() => void 0));
  }

  deleteMultipleProductos(ids: number[]): Observable<void> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/delete-multiple`, {
        body: ids,
      })
      .pipe(map(() => void 0));
  }
}
