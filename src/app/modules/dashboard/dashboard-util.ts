import { computed } from '@angular/core';
import { ChartConfigService } from '../../core/services/chart-config.service';

/**
 * Genera las opciones de gráficos para el Dashboard.
 * Se extrae aquí para mantener el componente limpio.
 */
export function createDashboardOptions(chartConfigService: ChartConfigService) {
  const lineOptions = computed(() =>
    chartConfigService.getOptions('line', {
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        title: {
          display: true,
          text: 'Evolución de Compras vs. Ventas (Saldo Neto)',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    }),
  );

  const barVerticalOptions = computed(() =>
    chartConfigService.getOptions('bar', {
      indexAxis: 'x',
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        title: {
          display: true,
          text: 'Movimientos de Inventario Mensuales',
        },
      },
    }),
  );

  const barHorizontalOptions = computed(() =>
    chartConfigService.getOptions('bar', {
      indexAxis: 'y',
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        title: {
          display: true,
          text: 'Top 10 Productos con Mayor Rotación (Salidas)',
        },
      },
      scales: {
        y: {
          ticks: {
            autoSkip: true, // Muestra todos los labels aunque sean muchos
          },
        },
      },
    }),
  );

  const doughnutOptions = computed(() =>
    chartConfigService.getOptions('doughnut', {
      cutout: '60%',
      plugins: {
        legend: {
          position: 'left',
        },
        title: {
          display: true,
          text: 'Valorización del Inventario por Categoría',
        },
      },
    }),
  );

  return {
    lineOptions,
    barVerticalOptions: barVerticalOptions,
    barHorizontalOptions: barHorizontalOptions,
    doughnutOptions,
  };
}
