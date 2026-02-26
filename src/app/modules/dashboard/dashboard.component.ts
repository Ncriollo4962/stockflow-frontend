import { Component, inject, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ChartConfigService } from '../../core/services/chart-config.service';
import { ImportsModule } from '../../imports';
import { createDashboardOptions } from './dashboard-util';

@Component({
  selector: 'app-dashboard',
  imports: [ChartModule, ImportsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  chartDataEvolucionComprasVentas: any;
  chartDataMovimientosInventario: any;
  chartDataTop10Productos: any;
  chartDataValorizacionInventarioPorCateg: any;
  productosRecientes: any[] = [];

  private readonly chartConfigService = inject(ChartConfigService);

  private readonly options = createDashboardOptions(this.chartConfigService);
  lineOptions = this.options.lineOptions;
  barVerticalOptions = this.options.barVerticalOptions;
  doughnutOptions = this.options.doughnutOptions;
  barHorizontalOptions = this.options.barHorizontalOptions;

  ngOnInit() {
    this.chartDataEvolucionComprasVentas = this.chartConfigService.createData(
      ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
      [
        this.chartConfigService.createDataset({
          label: 'Ventas (Saldo Neto)',
          data: [65, 59, 80, 120, 150],
          type: 'line',
          colorIndex: 0,
        }),
        this.chartConfigService.createDataset({
          label: 'Compras (Saldo Neto)',
          data: [50, 36, 85, 120, 170],
          type: 'line',
          colorIndex: 1,
        }),
      ],
    );

    this.chartDataMovimientosInventario = this.chartConfigService.createData(
      ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      [
        this.chartConfigService.createDataset({
          label: 'Entradas (CUS11)',
          data: [65, 59, 80, 120, 150, 180],
          type: 'bar',
          colorIndex: 0,
          fill: true,
        }),
        this.chartConfigService.createDataset({
          label: 'Salidas (CUS14)',
          data: [28, 48, 40, 120, 150, 200],
          type: 'bar',
          colorIndex: 7,
        }),
      ],
    );

    this.chartDataTop10Productos = this.chartConfigService.createData(
      [
        'Top 1',
        'Top 2',
        'Top 3',
        'Top 4',
        'Top 5',
        'Top 6',
        'Top 7',
        'Top 8',
        'Top 9',
        'Top 10',
      ],
      [
        this.chartConfigService.createDataset({
          label: 'Top 10 Productos',
          data: [65, 59, 80, 120, 150, 180, 200, 110, 90, 70],
          type: 'bar',
          colorIndex: 11,
          fill: false,
        }),
      ],
    );

    this.chartDataValorizacionInventarioPorCateg =
      this.chartConfigService.createData(
        [
          'Herramientas',
          'Materiales',
          'Equipos',
          'Accesorios',
          'Muebles',
          'Oficina',
          'Cerraduras',
          'Otro',
        ],
        [
          this.chartConfigService.createDataset({
            label: 'Categoría',
            data: [65, 59, 80, 120, 150, 180, 200, 110],
            type: 'doughnut',
          }),
        ],
      );
  }
}
