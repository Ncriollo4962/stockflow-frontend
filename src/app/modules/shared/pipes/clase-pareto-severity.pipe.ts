import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'claseParetoSeverity',
  standalone: true,
})
export class ClaseParetoSeverityPipe implements PipeTransform {
  transform(
    clase: string | null | undefined,
  ):
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | undefined {
    const value = String(clase ?? '')
      .trim()
      .toUpperCase();
    if (value === 'A') return 'success';
    if (value === 'B') return 'warn';
    if (value === 'C') return 'danger';
    if (!value) return 'secondary';
    return 'info';
  }
}
