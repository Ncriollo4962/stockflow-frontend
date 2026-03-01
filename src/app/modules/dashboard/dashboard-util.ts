import { computed } from '@angular/core';
import { ChartConfigService } from '../../core/services/chart-config.service';

/**
 * Genera las opciones de gráficos para el Dashboard.
 * Se extrae aquí para mantener el componente limpio.
 */
export function createDashboardOptions(chartConfigService: ChartConfigService) {
  const barLineOptions = computed(() =>
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
          text: 'Top 10 Productos con Mayor Rotación',
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
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.raw || 0;
              const dataset = context.dataset;
              const total = dataset.data.reduce(
                (acc: number, curr: number) => acc + curr,
                0,
              );
              const percentage = ((value / total) * 100).toFixed(1) + '%';
              return `${label}: ${value.toLocaleString()} (${percentage})`;
            },
          },
        },
        title: {
          display: true,
          text: 'Valorización del Inventario por Categoría',
        },
      },
    }),
  );

  return {
    lineOptions: barLineOptions,
    barVerticalOptions: barVerticalOptions,
    barHorizontalOptions: barHorizontalOptions,
    doughnutOptions,
  };
}
