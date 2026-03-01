import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ChartConfigService } from '../../core/services/chart-config.service';
import { ImportsModule } from '../../imports';
import { createDashboardOptions } from './dashboard-util';
import { DashboardService } from '../../core/services/dashboard.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  imports: [ChartModule, ImportsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  chartDataEvolucionComprasVentas!: Signal<any>;
  chartDataMovimientosInventario!: Signal<any>;
  chartDataTop10Productos!: Signal<any>;
  chartDataValorizacionInventarioPorCateg!: Signal<any>;
  productosRecientes: any[] = [];
  year = new Date().getFullYear();

  private readonly chartConfigService = inject(ChartConfigService);
  private readonly dashboardService = inject(DashboardService);

  private readonly options = createDashboardOptions(this.chartConfigService);
  barLineOptions = this.options.lineOptions;
  barVerticalOptions = this.options.barVerticalOptions;
  doughnutOptions = this.options.doughnutOptions;
  barHorizontalOptions = this.options.barHorizontalOptions;

  countProductsRx = rxResource({
    loader: () => this.dashboardService.countProducts(),
  });

  countProductsCriticalStockRx = rxResource({
    loader: () => this.dashboardService.countProductsCriticalStock(),
  });

  countOrdenVentaPendienteDespachoRx = rxResource({
    loader: () => this.dashboardService.countOrdenVentaPendienteDespacho(),
  });

  countOrdenCompraPendienteRecepcionRx = rxResource({
    loader: () => this.dashboardService.countOrdenCompraPendienteRecepcion(),
  });

  chartMovimientosRx = rxResource({
    request: () => this.year,
    loader: ({ request }) => this.dashboardService.chartMovimientos(request),
  });

  chartComprasVentasRx = rxResource({
    request: () => this.year,
    loader: ({ request }) => this.dashboardService.chartComprasVentas(request),
  });

  chartTopProductosSalidasRx = rxResource({
    request: () => this.year,
    loader: ({ request }) =>
      this.dashboardService.chartTopProductosSalidas(request),
  });

  chartValorizacionInventarioPorCategRx = rxResource({
    loader: () =>
      this.dashboardService.chartValorizacionInventarioPorCategoria(),
  });

  ngOnInit() {
    this.chartDataEvolucionComprasVentas = computed(() => {
      const data = this.chartComprasVentasRx.value();
      if (!data?.datasets || data.datasets.length < 3) return {};

      // Identificar datasets (por label o índice)
      const comprasRaw =
        data.datasets.find((d: any) =>
          d.label.toLowerCase().includes('compras'),
        ) || data.datasets[0];

      const ventasRaw =
        data.datasets.find((d: any) =>
          d.label.toLowerCase().includes('ventas'),
        ) || data.datasets[1];

      const saldoRaw =
        data.datasets.find((d: any) =>
          d.label.toLowerCase().includes('saldo'),
        ) || data.datasets[2];

      const datasets = [
        this.chartConfigService.createDataset({
          label: comprasRaw.label,
          data: comprasRaw.data,
          type: 'bar',
          colorIndex: 9,
          fill: false,
        }),
        this.chartConfigService.createDataset({
          label: ventasRaw.label,
          data: ventasRaw.data,
          type: 'bar',
          colorIndex: 11,
          fill: false,
        }),
        this.chartConfigService.createDataset({
          label: saldoRaw.label,
          data: saldoRaw.data,
          type: 'line',
          colorIndex: 3,
          fill: false,
          moreOptions: {
            tension: 0.4,
            borderDash: [5, 5],
            order: 0,
          },
        }),
      ];

      return this.chartConfigService.createData(data.labels, datasets);
    });

    this.chartDataMovimientosInventario = computed(() => {
      const data = this.chartMovimientosRx.value();
      if (!data) return {};

      return this.chartConfigService.createData(
        data.labels,
        data.datasets.map((dataset: any, index: number) =>
          this.chartConfigService.createDataset({
            label: dataset.label,
            data: dataset.data,
            type: 'bar',
            colorIndex: index === 0 ? 0 : 7,
            fill: true,
          }),
        ),
      );
    });

    this.chartDataTop10Productos = computed(() => {
      const data = this.chartTopProductosSalidasRx.value();
      if (!data) return {};

      return this.chartConfigService.createData(
        data.labels,
        data.datasets.map((dataset: any, index: number) =>
          this.chartConfigService.createDataset({
            label: dataset.label,
            data: dataset.data,
            type: 'bar',
            colorIndex: index + 5,
            fill: true,
          }),
        ),
      );
    });

    this.chartDataValorizacionInventarioPorCateg = computed(() => {
      const data = this.chartValorizacionInventarioPorCategRx.value();
      if (!data) return {};

      return this.chartConfigService.createData(
        data.labels,
        data.datasets.map((dataset: any, index: number) =>
          this.chartConfigService.createDataset({
            label: dataset.label,
            data: dataset.data,
            type: 'doughnut',
            colorIndex: index + 10,
            fill: true,
          }),
        ),
      );
    });
  }
}
