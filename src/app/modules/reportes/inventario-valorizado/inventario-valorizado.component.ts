import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { Categoria } from '../../../core/models/Categoria';
import { Ubicacion } from '../../../core/models/Ubicacion';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ExportService } from '../../../core/services/exportService.service';
import { ReporteService } from '../../../core/services/reporte.service';
import { UbicacionService } from '../../../core/services/ubicacion.service';
import { ImportsModule } from '../../../imports';
import {
  Column,
  DataTableComponent,
} from '../../shared/components/data-table/data-table.component';
import { AbastecimientoSeverityPipe } from '../../shared/pipes/abastecimiento-severity.pipe';
import { ReporteInventarioFiltroRequest } from '../../../core/models/ReporteInventarioFiltroRequest';

@Component({
  selector: 'app-inventario-valorizado',
  standalone: true,
  imports: [ImportsModule, CurrencyPipe, DataTableComponent],
  templateUrl: './inventario-valorizado.component.html',
})
export class InventarioValorizadoComponent implements OnInit {
  filtroForm!: FormGroup;
  loading = false;
  reporteData: any = null;
  abastecimientoSeverityPipe = new AbastecimientoSeverityPipe();
  ubicaciones: Ubicacion[] = [];
  categorias: Categoria[] = [];

  reporteRequest = signal<{
    filtros: ReporteInventarioFiltroRequest;
    nonce: number;
  } | null>(null);

  private readonly fb = inject(FormBuilder);
  private readonly reporteService = inject(ReporteService);
  private readonly ubicacionService = inject(UbicacionService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly exportService = inject(ExportService);

  private readonly reporteRx = rxResource({
    request: () => this.reporteRequest(),
    loader: ({ request }) => {
      if (!request) return of(null);
      return this.reporteService.inventarioValorizado(request.filtros);
    },
  });

  private readonly syncReporteState = effect(() => {
    this.loading = this.reporteRx.isLoading();
    this.reporteData = this.reporteRx.value() ?? null;
  });

  estados = [
    { label: 'Todos', value: null },
    { label: 'Activos', value: true },
    { label: 'Inactivos', value: false },
  ];

  soloConStockOptions = [
    { label: 'Todos', value: null },
    { label: 'Sí', value: true },
    { label: 'No', value: false },
  ];

  columns: Column[] = [
    { field: 'sku', header: 'SKU', type: 'text', style: { width: '7rem' } },
    {
      field: 'nombre',
      header: 'Nombre',
      type: 'text',
      style: { width: '18rem' },
    },
    {
      field: 'categoria',
      header: 'Categoría',
      type: 'text',
      style: { width: '14rem' },
    },
    {
      field: 'stock',
      header: 'Stock',
      type: 'number',
      style: { width: '6rem' },
    },
    {
      field: 'reservado',
      header: 'Reservado',
      type: 'number',
      style: { width: '10rem' },
    },
    {
      field: 'stockDisponible',
      header: 'Disponible',
      type: 'number',
      style: { width: '10rem' },
    },
    {
      field: 'costoUnitario',
      header: 'Costo unit.',
      type: 'currency',
      style: { width: '10rem' },
    },
    {
      field: 'precioVenta',
      header: 'Precio venta',
      type: 'currency',
      style: { width: '10rem' },
    },
    {
      field: 'cantidadMinima',
      header: 'Cant. mín.',
      type: 'number',
      style: { width: '8rem' },
    },
    {
      field: 'valorTotal',
      header: 'Valor total',
      type: 'currency',
      style: { width: '11rem' },
    },
    {
      field: 'valorDisponible',
      header: 'Valor disp.',
      type: 'currency',
      style: { width: '11rem' },
    },
    {
      field: 'participacionPorcentaje',
      header: '% Part.',
      type: 'percent',
      style: { width: '7rem' },
    },
    {
      field: 'estadoAbastecimiento',
      header: 'Abastecimiento',
      type: 'tag',
      tagSeverity: (value) => this.abastecimientoSeverityPipe.transform(value),
      style: { width: '10rem' },
    },
    {
      field: 'fechaUltimoMovimiento',
      header: 'Últ. movimiento',
      type: 'date',
      style: { width: '11rem' },
    },
    {
      field: 'margenContribucionPorcentaje',
      header: '% Margen',
      type: 'percent',
      style: { width: '8rem' },
    },
  ];

  ngOnInit() {
    this.crearFiltroForm();
    this.cargarCatalogos();
  }

  crearFiltroForm() {
    this.filtroForm = this.fb.group({
      soloConStock: [null],
      categoriaId: [null],
      estado: [null],
    });
  }

  cargarCatalogos() {
    this.ubicacionService
      .getAll()
      .subscribe((data) => (this.ubicaciones = data || []));
    this.categoriaService
      .getAll()
      .subscribe((data) => (this.categorias = data || []));
  }

  generarReporte() {
    this.reporteData = null;
    this.reporteRequest.set({
      filtros: this.filtroForm.value as ReporteInventarioFiltroRequest,
      nonce: Date.now(),
    });
  }

  private getFieldValue(rowData: any, field: string): any {
    if (!rowData) return '';
    const parts = field.split('.');
    let value = rowData;
    for (const part of parts) {
      value = value?.[part];
    }
    return value;
  }

  private getEstadoLabel(estado: boolean | null | undefined): string {
    if (estado === true) return 'Activos';
    if (estado === false) return 'Inactivos';
    return 'Todos';
  }

  private readonly dateTimeFormatter = new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  private formatDateTime(value: unknown): string {
    const date = value ? new Date(value as any) : null;
    if (!date || Number.isNaN(date.getTime())) return '';
    return this.dateTimeFormatter.format(date);
  }

  private formatExportValue(row: any, col: Column): any {
    const raw = this.getFieldValue(row, col.field);
    if (raw === null || raw === undefined) return '';

    const moneda = this.reporteData?.resumen?.moneda || 'PEN';
    const currency = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: moneda,
    });
    const number = new Intl.NumberFormat('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    if (col.type === 'currency') return currency.format(Number(raw));
    if (col.type === 'percent' || col.type === '%')
      return `${number.format(Number(raw))}%`;
    if (col.type === 'date') {
      return this.formatDateTime(raw);
    }

    return raw;
  }

  exportExcel(): void {
    if (!this.reporteData) return;

    const resumen = this.reporteData?.resumen ?? {};
    const moneda = resumen?.moneda || 'PEN';
    const currency = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: moneda,
    });

    const estadoLabel = this.getEstadoLabel(resumen?.estado);

    const rows = (this.reporteData?.data || []).map((row: any) => {
      const out: Record<string, any> = {};
      for (const col of this.columns) {
        out[col.header] = this.formatExportValue(row, col);
      }
      return out;
    });

    const titleBase = this.reporteData?.reporte || 'Inventario valorizado';
    const safeTitle = String(titleBase).replaceAll(/[\\/:*?"<>|]/g, '-');

    this.exportService.exportExcel(rows, 'inventario-valorizado', {
      title: safeTitle,
      subtitle: `Generado: ${this.formatDateTime(this.reporteData?.fechaGeneracion)}`,
      meta: [
        { label: 'Categoría', value: String(resumen?.categoria ?? '') },
        { label: 'Estado', value: estadoLabel },
        {
          label: 'Solo con stock',
          value: resumen?.soloConStock === true ? 'Sí' : 'No',
        },
        { label: 'Moneda', value: String(moneda) },
        { label: 'Total items', value: String(resumen?.totalItems ?? '') },
        {
          label: 'Valor total',
          value: currency.format(Number(resumen?.valorTotal ?? 0)),
        },
        {
          label: 'Productos en riesgo',
          value: String(resumen?.productosEnRiesgo ?? ''),
        },
      ],
      sheetName: 'Inventario valorizado',
    });
  }

  exportPdf(): void {
    if (!this.reporteData) return;

    const columns = this.columns.map((c) => c.header);
    const body = (this.reporteData?.data || []).map((row: any) =>
      this.columns.map((col) => String(this.formatExportValue(row, col))),
    );

    const titleBase = this.reporteData?.reporte || 'Inventario valorizado';
    const safeTitle = String(titleBase).replaceAll(/[\\/:*?"<>|]/g, '-');

    const resumen = this.reporteData?.resumen ?? {};
    const moneda = resumen?.moneda || 'PEN';
    const currency = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: moneda,
    });

    const estadoLabel = this.getEstadoLabel(resumen?.estado);
    const totalCols = this.columns.length;
    const colSpanA = Math.max(1, Math.ceil(totalCols / 3));
    const colSpanB = Math.max(1, Math.ceil((totalCols - colSpanA) / 2));
    const colSpanC = Math.max(1, totalCols - colSpanA - colSpanB);

    const meta = [
      { label: 'Categoría', value: String(resumen?.categoria ?? '') },
      { label: 'Estado', value: estadoLabel },
      {
        label: 'Solo con stock',
        value: resumen?.soloConStock === true ? 'Sí' : 'No',
      },
      { label: 'Moneda', value: String(moneda) },
    ];

    this.exportService.exportPdf(columns, body, safeTitle, {
      subtitle: `Generado: ${this.formatDateTime(this.reporteData?.fechaGeneracion)}`,
      meta,
      extraHeadRows: [
        [
          {
            content: `Total items: ${String(resumen?.totalItems ?? '')}`,
            colSpan: colSpanA,
            styles: { fillColor: [255, 255, 255], textColor: [17, 24, 39] },
          },
          {
            content: `Valor total: ${currency.format(Number(resumen?.valorTotal ?? 0))}`,
            colSpan: colSpanB,
            styles: { fillColor: [255, 255, 255], textColor: [17, 24, 39] },
          },
          {
            content: `Productos en riesgo: ${String(resumen?.productosEnRiesgo ?? '')}`,
            colSpan: colSpanC,
            styles: { fillColor: [255, 255, 255], textColor: [17, 24, 39] },
          },
        ],
      ],
      orientation: 'landscape',
    });
  }
}
