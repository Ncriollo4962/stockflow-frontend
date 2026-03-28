import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rolUsuarioLabel',
  standalone: true,
})
export class RolUsuarioLabelPipe implements PipeTransform {
  transform(value: unknown): string | undefined {
    if (value === null || value === undefined) return undefined;

    const raw = String(value).trim();
    if (!raw) return undefined;

    const known: Record<string, string> = {
      ROLE_ADMIN_TI: 'Admin TI',
      ROLE_ASISTENTE: 'Asistente',
      ROLE_VENDEDOR: 'Vendedor',
      ROLE_GERENTE_ALMACEN: 'Gerente de Almacén',
      ROLE_ALMACENERO: 'Almacenero',
    };

    const normalized = raw.toUpperCase();
    if (known[normalized]) return known[normalized];

    const noPrefix = normalized.startsWith('ROLE_')
      ? normalized.slice('ROLE_'.length)
      : normalized;

    const words = noPrefix
      .split(/[_\s]+/g)
      .filter(Boolean)
      .map((w) => {
        if (w.length <= 2) return w;
        if (w === 'TI') return 'TI';
        if (w === 'ALMACEN') return 'Almacén';
        return w.charAt(0) + w.slice(1).toLowerCase();
      });

    return words.join(' ');
  }
}
