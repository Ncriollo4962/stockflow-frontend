import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReporteInventarioFiltroRequest } from '../models/ReporteInventarioFiltroRequest';
import { ApiResponse } from '../utils/ApiResponse';
import { ReporteResponseDto } from '../models/ReporteResponseDto';
import { ReporteParetoVentasFiltroRequest } from '../models/ReporteParetoVentasFiltroRequest';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  private readonly apiUrl = `${environment.HOST_STOCKFLOW}/reportes`;

  constructor(private readonly http: HttpClient) {}

  private toParams(filtros: unknown): HttpParams {
    let params = new HttpParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params = params.set(key, value.toString());
        }
      });
    }

    return params;
  }

  inventarioValorizado(
    filtros: ReporteInventarioFiltroRequest,
  ): Observable<ReporteResponseDto> {
    const params = this.toParams(filtros);
    return this.http
      .get<
        ApiResponse<ReporteResponseDto>
      >(`${this.apiUrl}/inventario-valorizado`, { params })
      .pipe(
        map((resp) => {
          return resp.data
            ? resp.data
            : (resp as unknown as ReporteResponseDto);
        }),
      );
  }

  paretoAbcVentas(
    filtros: ReporteParetoVentasFiltroRequest,
  ): Observable<ReporteResponseDto> {
    const params = this.toParams(filtros);
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/pareto-abc-ventas`, { params })
      .pipe(map((resp: any) => (resp?.data ?? resp) as ReporteResponseDto));
  }
}
