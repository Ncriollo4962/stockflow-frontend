import { Injectable, computed, inject } from '@angular/core';
import { ThemeService } from './theme.service';

@Injectable({
  providedIn: 'root',
})
export class ChartConfigService {
  private readonly themeService = inject(ThemeService);

  private readonly themeConfig = computed(() => {
    const isDark = this.themeService.isDarkMode();
    return {
      textColor: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
      gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    };
  });

  readonly colors = [
    '#3B82F6', // Blue: Confianza, estabilidad
    '#10B981', // Emerald: Crecimiento, éxito
    '#6366F1', // Indigo: Profundidad, inteligencia
    '#F59E0B', // Amber: Atención, dinamismo
    '#EC4899', // Pink: Innovación, energía
    '#8B5CF6', // Violet: Creatividad, premium
    '#14B8A6', // Teal: Frescura, renovación
    '#F43F5E', // Rose: Urgencia, pasión
    '#64748B', // Slate: Neutralidad, equilibrio
    '#06B6D4', // Cyan: Claridad, tecnología
    '#84CC16', // Lime: Naturaleza, vivacidad
    '#D946EF', // Fuchsia: Modernidad
    '#F97316', // Orange: Entusiasmo
    '#0EA5E9', // Sky: Transparencia
    '#A855F7', // Purple: Lujo
  ];

  /**
   * Crea la estructura de datos para el gráfico
   */
  createData(labels: string[], datasets: any[]) {
    return {
      labels,
      datasets,
    };
  }

  /**
   * Genera un dataset con estilos predeterminados
   * @param config Configuración del dataset
   */
  createDataset(config: {
    label: string;
    data: number[];
    type?: 'line' | 'bar' | 'pie' | 'doughnut';
    colorIndex?: number;
    fill?: boolean;
    distributed?: boolean; // Nuevo: Para colorear cada punto diferente (útil en Pie/Doughnut)
    moreOptions?: any;
  }) {
    // Si no se especifica colorIndex, se selecciona automáticamente basado en el label o random
    const idx = config.colorIndex ?? 0;
    const singleColor = this.colors[idx % this.colors.length];

    const baseDataset: any = {
      label: config.label,
      data: config.data,
      borderWidth: 1,
      ...config.moreOptions,
    };

    // Lógica de colores
    if (
      config.distributed ||
      config.type === 'pie' ||
      config.type === 'doughnut'
    ) {
      // Colores distribuidos (uno por punto de datos)
      baseDataset.backgroundColor = this.colors;
      baseDataset.borderColor = this.colors.map((c) => c); // Opcional: bordes iguales al fondo
      baseDataset.hoverBackgroundColor = this.colors.map((c) => `${c}CC`);
    } else if (config.type === 'line') {
      // Color único para  el dataset (serie) - Línea
      baseDataset.borderColor = singleColor;
      baseDataset.pointBackgroundColor = singleColor;
      baseDataset.pointBorderColor = singleColor;
      baseDataset.backgroundColor = config.fill
        ? `${singleColor}33`
        : singleColor;
      baseDataset.tension = 0.4;
      baseDataset.fill = config.fill || false;
    } else {
      // Bar default y otros (color único)
      baseDataset.backgroundColor = singleColor;
      baseDataset.borderColor = singleColor;
    }

    return baseDataset;
  }

  /**
   * Genera opciones de gráfico que se adaptan al tema actual.
   * IMPORTANTE: Usar dentro de un computed() en el componente para mantener la reactividad.
   *
   * @param type Tipo de gráfico ('line', 'bar', 'pie', 'doughnut')
   * @param overrides Opciones personalizadas para sobrescribir la configuración base
   */
  getOptions(
    type: 'line' | 'bar' | 'pie' | 'doughnut',
    overrides: any = {},
  ): any {
    const { textColor, gridColor } = this.themeConfig();

    const baseOptions: any = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
    };

    // Agregar escalas solo para gráficos cartesianos (línea/barra)
    if (type === 'line' || type === 'bar') {
      baseOptions.scales = {
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor, drawBorder: false },
        },
        y: {
          ticks: { color: textColor },
          grid: { color: gridColor, drawBorder: false },
        },
      };
    }

    // Merge manual para asegurar que no se pierdan propiedades anidadas importantes
    const mergedOptions = {
      ...baseOptions,
      ...overrides,
      plugins: {
        ...baseOptions.plugins,
        ...overrides.plugins,
      },
    };

    // Merge inteligente de escalas para no perder estilos base (colores de grid/texto)
    if (baseOptions.scales || overrides.scales) {
      const baseScales = baseOptions.scales || {};
      const overrideScales = overrides.scales || {};

      mergedOptions.scales = {
        x: { ...(baseScales.x || {}), ...(overrideScales.x || {}) },
        y: { ...(baseScales.y || {}), ...(overrideScales.y || {}) },
      };
    }

    return mergedOptions;
  }
}
