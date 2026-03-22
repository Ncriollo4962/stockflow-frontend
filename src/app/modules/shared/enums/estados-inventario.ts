export enum EstadosMovInventario {
  ENTRADA = 'Entrada',
  SALIDA = 'Salida',
  TRANSFERENCIA = 'Transferencia Mercaderia',
}

export enum EstadosMovInventarioMes {
  AJUSTE_SALIDA_INVENTARIO = 'Ajustes Salida Inventario Mensual',
  AJUSTE_ENTRADA_INVENTARIO = 'Ajustes Entrada Inventario Mensual',
}

export const listEstadosMovInventario = Object.values(EstadosMovInventario);
export const listEstadosMovInventarioMes = Object.values(
  EstadosMovInventarioMes,
);
