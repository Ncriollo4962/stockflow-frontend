import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Proveedor } from '../models/Proveedor';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../utils/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  private readonly apiUrl = `${environment.HOST_STOCKFLOW}/proveedores`;

  constructor(private readonly http: HttpClient) {}

  getProveedores(): Observable<Proveedor[]> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/all`)
      .pipe(map((response) => response.data || []));
  }

  getProveedorById(id: number): Observable<Proveedor> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  createProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http
      .post<ApiResponse>(`${this.apiUrl}/register`, proveedor)
      .pipe(map((response) => response.data));
  }

  updateProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http
      .put<ApiResponse>(`${this.apiUrl}/update`, proveedor)
      .pipe(map((response) => response.data));
  }

  deleteProveedor(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/delete/${id}`)
      .pipe(map(() => void 0));
  }

  deleteMultipleProveedores(ids: number[]): Observable<void> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/delete-multiple`, {
        body: ids,
      })
      .pipe(map(() => void 0));
  }
}
