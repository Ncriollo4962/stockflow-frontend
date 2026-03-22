import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MovimientoInventario } from '../../../core/models/MovimientoInventario';
import { MovimientoInventarioService } from '../../../core/services/movimiento-inventario.service';
import { ImportsModule } from '../../../imports';
import {
  Column,
  DataTableComponent,
} from '../../shared/components/data-table/data-table.component';
import { RegeditMovimientoInventarioComponent } from './regedit-movimiento-inventario/regedit-movimiento-inventario.component';

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [
    ImportsModule,
    DataTableComponent,
    RegeditMovimientoInventarioComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './movimiento-inventario.component.html',
})
export class MovimientoInventarioComponent implements OnInit {
  movimientos: MovimientoInventario[] = [];
  selectedMovimientos: MovimientoInventario[] = [];
  dialogVisible: boolean = false;

  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;

  cols!: Column[];
  exportColumns!: ExportColumn[];

  private readonly movimientoService = inject(MovimientoInventarioService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit() {
    this.loadMovimientos();

    this.cols = [
      { field: 'producto.nombre', header: 'Producto' },
      { field: 'tipoMovimiento', header: 'Tipo' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'ubicacion.nombre', header: 'Ubicación' },
      { field: 'fechaMovimiento', header: 'Fecha', type: 'date' },
      { field: 'usuario.nombre', header: 'Usuario' },
      { field: 'referencia', header: 'Referencia' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  loadMovimientos() {
    this.movimientoService.getAll().subscribe({
      next: (data) => {
        this.movimientos = data;
        this.cd.markForCheck();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los movimientos de inventario',
        });
      },
    });
  }

  openNew() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  editMovimiento(movimiento: MovimientoInventario) {
    this.router.navigate(['edit', movimiento.id], { relativeTo: this.route });
  }

  deleteMovimiento(movimiento: MovimientoInventario) {
    this.confirmationService.confirm({
      message:
        '¿Estás seguro de que deseas eliminar el movimiento de ' +
        movimiento.producto?.nombre +
        '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (movimiento.id) {
          this.movimientoService.delete(movimiento.id).subscribe({
            next: () => {
              this.movimientos = this.movimientos.filter(
                (val) => val.id !== movimiento.id,
              );
              this.messageService.add({
                severity: 'success',
                summary: 'Exitoso',
                detail: 'Movimiento Eliminado',
                life: 3000,
              });
              this.cd.markForCheck();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo eliminar el movimiento',
              });
            },
          });
        }
      },
    });
  }

  deleteSelectedMovimientos(movimientos: MovimientoInventario[]) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar los movimientos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = movimientos
          .map((m) => m.id)
          .filter((id): id is number => id !== null);
        if (ids.length > 0) {
          this.movimientoService.deleteMultiple(ids).subscribe({
            next: () => {
              this.movimientos = this.movimientos.filter(
                (val) => !ids.includes(val.id as number),
              );
              this.selectedMovimientos = [];
              this.messageService.add({
                severity: 'success',
                summary: 'Exitoso',
                detail: 'Movimientos Eliminados',
                life: 3000,
              });
              this.cd.markForCheck();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron eliminar los movimientos',
              });
            },
          });
        }
      },
    });
  }
}
