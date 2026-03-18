export interface ReporteResponseDto {
  reporte: string;
  fechaGeneracion: string;
  resumen: Record<string, unknown>;
  data: Array<Record<string, unknown>>;
}
