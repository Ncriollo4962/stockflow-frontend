import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InventarioItem } from '../models/InventarioItem';
import { ApiResponse } from '../utils/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class InventarioItemService {
  private readonly apiUrl = `${environment.HOST_STOCKFLOW}/inventario`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<InventarioItem[]> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/all`)
      .pipe(map((response) => response.data || []));
  }

  getById(id: number): Observable<InventarioItem> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  create(item: InventarioItem): Observable<InventarioItem> {
    return this.http
      .post<ApiResponse>(`${this.apiUrl}/register`, item)
      .pipe(map((response) => response.data));
  }

  update(item: InventarioItem): Observable<InventarioItem> {
    return this.http
      .put<ApiResponse>(`${this.apiUrl}/update`, item)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/delete/${id}`)
      .pipe(map(() => void 0));
  }
}
