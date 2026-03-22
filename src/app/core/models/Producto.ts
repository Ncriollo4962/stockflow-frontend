import { Categoria } from './Categoria';

export class Producto {
  public id: number | null = null;
  public codigo: string | null = null;
  public nombre: string | null = null;
  public descripcion: string | null = null;
  public precioCosto: number | null = null;
  public precioVenta: number | null = null;
  public cantidadMinima: number | null = null;
  public estado: boolean | null = null;
  public version: number | null = null; // solo lectura
  public categoria: Categoria | null = null;
}
