import { Producto } from './Producto';
import { Ubicacion } from './Ubicacion';

export class InventarioItem {
  public id: number | null = null;
  public producto: Producto | null = null;
  public ubicacion: Ubicacion | null = null;
  public lote: string | null = null;
  public fechaVencimiento: string | null = null;
  public cantidad: number | null = null;
  public cantidadReservada: number | null = null;
  public fechaUltimoConteo: string | null = null;
  public version: number | null = null;
}
