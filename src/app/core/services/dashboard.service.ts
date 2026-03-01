import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../utils/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly apiUrl = `${environment.HOST_STOCKFLOW}/dashboard`;

  private readonly http = inject(HttpClient);

  countProducts(): Observable<number> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/count-products`)
      .pipe(map((resp) => resp.data));
  }

  countProductsCriticalStock(): Observable<number> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/count-products-critical-stock`)
      .pipe(map((resp) => resp.data));
  }

  countOrdenVentaPendienteDespacho(): Observable<number> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/count-orden-venta-pendiente-despacho`)
      .pipe(map((resp) => resp.data));
  }

  countOrdenCompraPendienteRecepcion(): Observable<number> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/count-orden-compra-pendiente-recepcion`)
      .pipe(map((resp) => resp.data));
  }

  chartMovimientos(year: number): Observable<any> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/chart-movimientos/${year}`)
      .pipe(map((resp) => resp.data));
  }

  chartComprasVentas(year: number): Observable<any> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/chart-compras-ventas/${year}`)
      .pipe(map((resp) => resp.data));
  }

  chartTopProductosSalidas(year: number): Observable<any> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/chart-top-productos-salidas/${year}`)
      .pipe(map((resp) => resp.data));
  }

  chartValorizacionInventarioPorCategoria(): Observable<any> {
    return this.http
      .get<ApiResponse>(
        `${this.apiUrl}/chart-valorizacion-inventario-categoria`,
      )
      .pipe(map((resp) => resp.data));
  }
}
