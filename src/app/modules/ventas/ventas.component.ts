import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrdenVenta } from '../../core/models/OrdenVenta';
import { OrdenVentaService } from '../../core/services/orden-venta.service';
import { ImportsModule } from '../../imports';
import {
  Column,
  DataTableComponent,
} from '../shared/components/data-table/data-table.component';
import { EstadoOrdenSeverityPipe } from '../shared/pipes/estado-orden-severity.pipe';

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [ImportsModule, DataTableComponent],
  providers: [ConfirmationService],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.scss',
})
export class VentasComponent implements OnInit {
  ordenesVenta: OrdenVenta[] = [];
  selectedOrdenes: OrdenVenta[] = [];
  statuses!: any[];

  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;

  cols!: Column[];
  exportColumns!: ExportColumn[];

  private readonly ordenVentaService = inject(OrdenVentaService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly estadoSeverity = new EstadoOrdenSeverityPipe();

  ngOnInit() {
    this.loadOrdenesVenta();

    this.cols = [
      { field: 'numeroOrden', header: 'N° Orden' },
      { field: 'clienteNombre', header: 'Cliente' },
      { field: 'fechaVenta', header: 'Fecha Venta', type: 'date' },
      { field: 'totalVenta', header: 'Total', type: 'currency' },
      { field: 'usuario.nombre', header: 'Vendedor' },
      {
        field: 'estado',
        header: 'Estado',
        type: 'tag',
        tagSeverity: (value) => this.estadoSeverity.transform(value),
      },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));

    this.statuses = [
      { label: 'APERTURADA', value: 'aperturada' },
      { label: 'CONFIRMADA', value: 'confirmada' },
      { label: 'CANCELADA', value: 'cancelada' },
    ];
  }

  loadOrdenesVenta() {
    this.ordenVentaService.getOrdenVentas().subscribe({
      next: (data) => {
        this.ordenesVenta = data;
        this.cd.markForCheck();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las órdenes de venta',
        });
      },
    });
  }

  openNew() {
    this.router.navigate(['newOrdenVenta'], { relativeTo: this.route });
  }

  editOrden(orden: OrdenVenta) {
    this.router.navigate(['editOrdenVenta', orden.id], {
      relativeTo: this.route,
    });
  }

  deleteOrden(orden: OrdenVenta) {
    this.confirmationService.confirm({
      message:
        '¿Estás seguro de que deseas eliminar la orden ' +
        orden.numeroOrden +
        '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (orden.id) {
          this.ordenVentaService.deleteOrdenVenta(orden.id).subscribe({
            next: () => {
              this.ordenesVenta = this.ordenesVenta.filter(
                (val) => val.id !== orden.id,
              );
              this.messageService.add({
                severity: 'success',
                summary: 'Exitoso',
                detail: 'Orden de Venta Eliminada',
                life: 1500,
              });
              this.loadOrdenesVenta();
              this.cd.markForCheck();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo eliminar la orden de venta',
              });
            },
          });
        }
      },
    });
  }

  deleteSelectedOrdenes(ordenes: OrdenVenta[]) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar las órdenes seleccionadas?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = ordenes
          .map((o) => o.id)
          .filter((id): id is number => id !== null);
        if (ids.length > 0) {
          // Implement deleteMultiple in service if available or iterate
          // Assuming deleteMultipleOrdenVentas exists in service (I added it earlier)
          this.ordenVentaService.deleteMultipleOrdenVentas(ids).subscribe({
            next: () => {
              this.ordenesVenta = this.ordenesVenta.filter(
                (val) => !ids.includes(val.id as number),
              );
              this.selectedOrdenes = [];
              this.messageService.add({
                severity: 'success',
                summary: 'Exitoso',
                detail: 'Órdenes de Venta Eliminadas',
                life: 1500,
              });
              this.loadOrdenesVenta();
              this.cd.markForCheck();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron eliminar las órdenes de venta',
              });
            },
          });
        }
      },
    });
  }
}
