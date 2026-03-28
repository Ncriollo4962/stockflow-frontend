import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../utils/ApiResponse';
import { Categoria } from '../models/Categoria';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private readonly apiUrl = `${environment.HOST_STOCKFLOW}/categorias`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Categoria[]> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/all`)
      .pipe(map((response) => response.data || []));
  }

  getById(id: number): Observable<Categoria> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  create(item: Categoria): Observable<Categoria> {
    return this.http
      .post<ApiResponse>(`${this.apiUrl}/register`, item)
      .pipe(map((response) => response.data));
  }

  update(item: Categoria): Observable<Categoria> {
    return this.http
      .put<ApiResponse>(`${this.apiUrl}/update`, item)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/delete/${id}`)
      .pipe(map(() => void 0));
  }

  deleteMultiple(ids: number[]): Observable<void> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/delete-multiple`, {
        body: ids,
      })
      .pipe(map(() => void 0));
  }
}
