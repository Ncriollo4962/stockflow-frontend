import { Usuario } from '../auth/interfaces/usuario';
import { Producto } from './Producto';
import { Ubicacion } from './Ubicacion';

export class MovimientoInventario {
  public id: number | null = null;
  public producto: Producto | null = null;
  public ubicacion: Ubicacion | null = null;
  public tipoMovimiento: string | null = null;
  public cantidad: number | null = null;
  public motivo: string | null = null;
  public usuario: Usuario | null = null;
  public referencia: string | null = null;
  public fechaMovimiento: string | null = null;
  public notas: string | null = null;
  public version: number | null = null;
}
