import { OrdenCompra } from './OrdenCompra';
import { Producto } from './Producto';

export class DetalleOrdenCompra {
  public id: number | null = null;
  public nroItemTemp: number | null = null;
  public ordenCompra: OrdenCompra | null = null;
  public producto: Producto | null = null;
  public cantidad: number | null = null;
  public cantidadRecibida: number = 0;
  public cantidadPendiente: number | null = null;
  public estadoDetalle: string | null = null;
  public precioUnitario: number | null = null;
  public subtotal: number | null = null; // solo lectura
}
