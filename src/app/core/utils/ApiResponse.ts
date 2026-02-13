export interface ApiResponse<T = any> {
  error: boolean;
  codigo: number | string;
  mensaje: string;
  data: T;
  titulo: string;
}
