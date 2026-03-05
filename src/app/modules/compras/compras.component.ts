import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrdenCompra } from '../../core/models/OrdenCompra';
import { OrdenCompraService } from '../../core/services/orden-compra.service';
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
  selector: 'app-compras',
  standalone: true,
  imports: [ImportsModule, DataTableComponent],
  providers: [ConfirmationService],
  templateUrl: './compras.component.html',
})
export class ComprasComponent implements OnInit {
  ordenesCompra: OrdenCompra[] = [];
  selectedOrdenes: OrdenCompra[] = [];
  statuses!: any[];

  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;

  cols!: Column[];
  exportColumns!: ExportColumn[];

  private readonly ordenCompraService = inject(OrdenCompraService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly estadoSeverity = new EstadoOrdenSeverityPipe();

  exportCSV() {
    this.dataTable.dt?.exportCSV();
  }

  ngOnInit() {
    this.loadOrdenes();
  }

  loadOrdenes() {
    this.ordenCompraService.getOrdenCompras().subscribe((data) => {
      this.ordenesCompra = data;
      this.cd.markForCheck();
    });

    this.cols = [
      { field: 'numeroOrden', header: 'Número Orden' },
      { field: 'proveedor.nombre', header: 'Proveedor' },
      { field: 'fechaOrdenCompra', header: 'Fecha', type: 'date' },
      { field: 'fechaEntrega', header: 'Fecha Entrega', type: 'date' },
      { field: 'totalCompra', header: 'Total', type: 'currency' },
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
  }

  openNew() {
    this.router.navigate(['newOrdenCompra'], { relativeTo: this.route });
  }

  editOrden(orden: OrdenCompra) {
    this.router.navigate(['editOrdenCompra', orden.id], {
      relativeTo: this.route,
    });
  }

  deleteOrden(orden: OrdenCompra) {
    this.confirmationService.confirm({
      message:
        '¿Estás seguro de que quieres eliminar la orden ' +
        orden.numeroOrden +
        '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordenCompraService.deleteOrdenCompra(orden.id!).subscribe({
          next: () => {
            this.ordenesCompra = this.ordenesCompra.filter(
              (val) => val.id !== orden.id,
            );
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Orden Eliminada',
              life: 3000,
            });
            this.cd.markForCheck();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la orden',
              life: 3000,
            });
          },
        });
      },
    });
  }

  deleteSelectedOrdenes(selected: OrdenCompra[]) {
    if (selected && selected.length > 0) {
      this.confirmationService.confirm({
        message:
          '¿Estás seguro de que quieres eliminar las ' +
          selected.length +
          ' órdenes seleccionadas?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.ordenCompraService
            .deleteMultipleOrdenCompras(selected.map((o) => o.id!))
            .subscribe(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'Órdenes eliminadas',
                detail: 'Todas las órdenes han sido eliminadas',
              });
              this.loadOrdenes();
              this.selectedOrdenes = [];
            });
        },
      });
    }
  }
}
