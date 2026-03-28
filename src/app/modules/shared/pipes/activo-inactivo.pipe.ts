import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activoInactivo',
  standalone: true,
})
export class ActivoInactivoPipe implements PipeTransform {
  transform(value: unknown): string | undefined {
    if (value === true) return 'Activo';
    if (value === false) return 'Inactivo';
    if (value === null || value === undefined) return undefined;
    return String(value);
  }
}
