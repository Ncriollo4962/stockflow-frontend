import { OrdenVenta } from './OrdenVenta';
import { Producto } from './Producto';

export class DetalleOrdenVenta {
  public id: number | null = null;
  public nroItemTemp: number | null = null;
  public ordenVenta: OrdenVenta | null = null;
  public producto: Producto | null = null;
  public cantidad: number | null = null;
  public precioUnitario: number | null = null;
  public subtotal: number | null = null; // solo lectura
  public cantidadDespachada: number | null = null;
  public cantidadPendiente: number | null = null;
  public estadoDetalle: string | null = null;
}
