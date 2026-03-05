export enum EstadosOrdenCompra {
  APERTURADA = 'Aperturada',
  APROBADA = 'Aprobada',
  ENVIADA = 'Enviada',
  RECHAZADA = 'Rechazada',
  ANULADA = 'Anulada',
  PENDIENTE_RECEPCION = 'Pendiente Recepción',
  RECIBIDA_PARCIAL = 'Recibida Parcial',
  RECIBIDA_COMPLETA = 'Recibida Completa',
  FINALIZADA = 'Finalizada',
}

export const listEstadosOrden = Object.values(EstadosOrdenCompra);
