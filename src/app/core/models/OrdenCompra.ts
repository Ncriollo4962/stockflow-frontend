import { Usuario } from '../auth/interfaces/usuario';
import { DetalleOrdenCompra } from './DetalleOrdenCompra';
import { Proveedor } from './Proveedor';

export class OrdenCompra {
  public id: number | null = null;
  public numeroOrden: string | null = null;
  public proveedor: Proveedor | null = null;
  public usuario: Usuario | null = null;
  public fechaOrdenCompra: string | null = null;
  public fechaEntrega: string | null = null;
  public estado: string | null = null;
  public totalCompra: number | null = null;
  public notas: string | null = null;
  public version: number | null = null; // solo lectura
  public detallesOrdenCompra: DetalleOrdenCompra[] | null = [];
}
