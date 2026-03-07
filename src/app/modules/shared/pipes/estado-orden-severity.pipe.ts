import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoOrdenSeverity',
  standalone: true,
})
export class EstadoOrdenSeverityPipe implements PipeTransform {
  transform(
    estado: string | null | undefined,
  ):
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | undefined {
    if (!estado) return undefined;

    const estadoUpper = estado.toUpperCase();

    // Normalizar espacios y guiones bajos para comparación flexible
    // 'PENDIENTE RECEPCION' -> 'PENDIENTE_RECEPCION'
    const estadoNormalizado = estadoUpper.replace(/\s+/g, '_');

    switch (estadoNormalizado) {
      case 'APROBADA':
      case 'RECIBIDA_COMPLETA':
        return 'success';

      case 'PENDIENTE_RECEPCION':
      case 'PENDIENTE_RECEPCIÓN': // Por si acaso con tilde
      case 'PENDIENTE_DESPACHO':
      case 'RECIBIDA_PARCIAL':
        return 'warn';

      case 'RECHAZADA':
      case 'ANULADA':
        return 'danger';

      case 'APERTURADA':
      case 'ENVIADA':
        return 'info';

      case 'FINALIZADA':
        return 'secondary';

      default:
        return 'secondary';
    }
  }
}
