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
    // Paleta Corporativa Principal (Tonos profundos y seguros)
    '#1E40AF', // Deep Blue: Confianza, autoridad (Índice 0)
    '#059669', // Emerald Green: Crecimiento, estabilidad financiera (Índice 1)
    '#B91C1C', // Deep Red: Alerta crítica, gastos (Índice 2)
    '#D97706', // Amber: Precaución, atención (Índice 3)
    '#4F46E5', // Indigo: Innovación tecnológica (Índice 4)
    // Paleta Secundaria (Tonos complementarios para diferenciación)
    '#0891B2', // Cyan: Claridad, flujo (Índice 5)
    '#7C3AED', // Violet: Premium, exclusividad (Índice 6)
    '#BE185D', // Pink: Energía controlada (Índice 7)
    '#EA580C', // Orange: Dinamismo (Índice 8)
    '#0D9488', // Teal: Frescura profesional (Índice 9)
    // Paleta Terciaria (Tonos neutros y de soporte)
    '#475569', // Slate: Neutralidad, datos históricos (Índice 10)
    '#65A30D', // Lime: Naturaleza, sostenibilidad (Índice 11)
    '#9333EA', // Purple: Creatividad (Índice 12)
    '#2563EB', // Royal Blue: Énfasis secundario (Índice 13)
    '#DC2626', // Red: Urgencia (Índice 14)
    // Paleta Extendida (Para gráficos con muchas categorías)
    '#0284C7', // Sky Blue (Índice 15)
    '#7E22CE', // Dark Purple (Índice 16)
    '#C026D3', // Fuchsia (Índice 17)
    '#CA8A04', // Dark Yellow (Índice 18)
    '#166534', // Green Forest (Índice 19)
    '#9F1239', // Rose (Índice 20)
    '#1E293B', // Dark Slate (Índice 21)
    '#374151', // Gray (Índice 22)
    '#57534E', // Stone (Índice 23)
    '#115E59', // Dark Teal (Índice 24)
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
      type: config.type,
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
      // Rotar el array de colores según el índice para variar el inicio
      const startIndex = idx % this.colors.length;
      const rotatedColors = [
        ...this.colors.slice(startIndex),
        ...this.colors.slice(0, startIndex),
      ];

      baseDataset.backgroundColor = rotatedColors;
      baseDataset.borderColor = rotatedColors; // Opcional: bordes iguales al fondo
      baseDataset.hoverBackgroundColor = rotatedColors.map((c) => `${c}CC`);
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
        x: { ...baseScales.x, ...overrideScales.x },
        y: { ...baseScales.y, ...overrideScales.y },
      };
    }

    return mergedOptions;
  }
}
