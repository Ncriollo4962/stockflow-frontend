import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoInventarioSeverity',
  standalone: true,
})
export class EstadoInventarioSeverityPipe implements PipeTransform {
  transform(
    status: any,
  ):
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | undefined {
    if (!status) return undefined;

    const value =
      typeof status === 'string' ? status : status.value || status.label || '';
    if (!value) return undefined;

    switch (value.toString().toUpperCase()) {
      case 'INSTOCK':
      case 'ENTRADA':
      case 'AJUSTE_ENTRADA_INVENTARIO':
        return 'success';
      case 'LOWSTOCK':
      case 'AJUSTE_SALIDA_INVENTARIO':
      case 'TRANSFERENCIA':
        return 'warn';
      case 'OUTOFSTOCK':
      case 'SALIDA':
        return 'danger';
      case 'OTROS':
        return 'secondary';
      default:
        return 'info';
    }
  }
}
