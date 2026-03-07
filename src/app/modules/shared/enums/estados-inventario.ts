export enum EstadosInventario {
  ENTRADA = 'Entrada',
  SALIDA = 'Salida',
  AJUSTE_SALIDA_INVENTARIO = 'Ajustes Salida Inventario Mensual',
  AJUSTE_ENTRADA_INVENTARIO = 'Ajustes Entrada Inventario Mensual',
  TRANSFERENCIA = 'Transferencia Mercaderia',
}

export const listEstadosInventario = Object.values(EstadosInventario);
