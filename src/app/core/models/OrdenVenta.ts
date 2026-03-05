import { Usuario } from '../auth/interfaces/usuario';
import { DetalleOrdenVenta } from './DetalleOrdenVenta';

export class OrdenVenta {
  public id: number | null = null;
  public numeroOrden: string | null = null;
  public usuario: Usuario | null = null;
  public clienteNombre: string | null = null;
  public clienteEmail: string | null = null;
  public clienteTelefono: string | null = null;
  public direccion: string | null = null;
  public fechaVenta: string | null = null;
  public totalVenta: number | null = null;
  public estado: string | null = null;
  public version: number | null = null; // solo lectura
  public detallesOrdenVenta: DetalleOrdenVenta[] | null = [];
}
