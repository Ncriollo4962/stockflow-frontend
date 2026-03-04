export enum EstadosOrden {
  PENDIENTE_RECEPCION = 'PENDIENTE_RECEPCION',
  RECEPCIONADA = 'RECEPCIONADA',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA',
  ANULADA = 'ANULADA',
}

export const listEstadosOrden = Object.values(EstadosOrden);
