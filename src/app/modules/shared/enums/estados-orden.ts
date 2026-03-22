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

export enum EstadosOrdenVenta {
  APERTURADA = 'Aperturada',
  APROBADA = 'Aprobada',
  ENVIADA = 'Enviada',
  RECHAZADA = 'Rechazada',
  ANULADA = 'Anulada',
  PENDIENTE_DESPACHO = 'Pendiente Despacho',
  PENDIENTE_PAGO = 'Pendiente Pago',
  PAGADA_PARCIAL = 'Pagada Parcial',
  PAGADA_COMPLETA = 'Pagada Completa',
  FINALIZADA = 'Finalizada',
}

export const listEstadosOrden = Object.values(EstadosOrdenCompra);
export const listEstadosOrdenVenta = Object.values(EstadosOrdenVenta);
