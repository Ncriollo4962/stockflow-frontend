import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abastecimientoSeverity',
  standalone: true,
})
export class AbastecimientoSeverityPipe implements PipeTransform {
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
    const value = (estado || '').toLowerCase();
    if (!value) return 'secondary';
    if (value.includes('quiebre') || value.includes('riesgo')) return 'danger';
    if (value.includes('sobrestock')) return 'warn';
    if (value.includes('ok') || value.includes('normal')) return 'success';
    return 'info';
  }
}
