import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { MovimientoInventario } from '../../../../core/models/MovimientoInventario';
import { MovimientoInventarioService } from '../../../../core/services/movimiento-inventario.service';
import { ProductoService } from '../../../../core/services/producto.service';
import { UbicacionService } from '../../../../core/services/ubicacion.service';
import { ImportsModule } from '../../../../imports';
import {
  EditableColumn,
  EditableTableComponent,
} from '../../../../modules/shared/components/editable-table/editable-table.component';
import { listEstadosInventario } from '../../../shared/enums/estados-inventario';

@Component({
  selector: 'app-regedit-movimiento-inventario',
  standalone: true,
  imports: [ImportsModule, EditableTableComponent],
  templateUrl: './regedit-movimiento-inventario.component.html',
})
export class RegeditMovimientoInventarioComponent implements OnInit {
  movimientos: MovimientoInventario[] = [];
  clonedMovimientos: { [s: string]: MovimientoInventario } = {};
  isSaving: boolean = false;

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saveSuccess = new EventEmitter<void>();

  listEstadosInventario = listEstadosInventario;

  // Table Configuration
  movimientoCols: EditableColumn[] = [];

  fb = inject(FormBuilder);
  movimientoService = inject(MovimientoInventarioService);
  productoService = inject(ProductoService);
  ubicacionService = inject(UbicacionService);
  usuarioLogueado = inject(AuthService);
  messageService = inject(MessageService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  productsRx = rxResource({
    loader: () => this.productoService.getProductos(),
  });

  ubicacionesRx = rxResource({
    loader: () => this.ubicacionService.getAll(),
  });

  constructor() {
    effect(() => {
      const products = this.productsRx.value() || [];
      const ubicaciones = this.ubicacionesRx.value() || [];

      this.movimientoCols = [
        {
          field: 'producto',
          header: 'Producto',
          type: 'select',
          options: products,
          optionLabel: 'nombre',
          required: true,
          style: 'min-width: 150px',
        },
        {
          field: 'ubicacion',
          header: 'Ubicación',
          type: 'select',
          options: ubicaciones,
          optionLabel: 'nombre',
          required: true,
          style: 'min-width: 150px',
        },
        {
          field: 'tipoMovimiento',
          header: 'Tipo Movimiento',
          type: 'select',
          options: this.listEstadosInventario.map((e) => ({
            label: e,
            value: e,
          })),
          optionLabel: 'label',
          optionValue: 'value',
          required: true,
          showTag: true,
          style: 'min-width: 100px',
        },
        {
          field: 'cantidad',
          header: 'Cantidad',
          type: 'number',
          required: true,
          style: 'width: 150px',
        },
        {
          field: 'motivo',
          header: 'Motivo',
          type: 'text',
          style: 'min-width: 150px',
        },
        {
          field: 'referencia',
          header: 'Referencia',
          type: 'text',
          style: 'min-width: 150px',
        },
        {
          field: 'fechaMovimiento',
          header: 'Fecha Movimiento',
          type: 'date',
          style: 'min-width: 170px',
        },
        {
          field: 'notas',
          header: 'Notas',
          type: 'text',
          style: 'min-width: 150px',
        },
      ];
    });
  }

  ngOnInit() {
    // Initialize with one empty row or load existing
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadMovimiento(+id);
      } else {
        // Start with one empty row
        this.addMovimiento();
      }
    });
  }

  loadMovimiento(id: number) {
    this.movimientoService.getById(id).subscribe({
      next: (movimiento) => {
        this.movimientos = [movimiento];
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el movimiento',
        });
      },
    });
  }

  addMovimiento() {
    const newMov = new MovimientoInventario();
    // Use negative ID for temporary tracking
    newMov.id = -Date.now();
    newMov.fechaMovimiento = new Date().toISOString();
    this.movimientos = [...this.movimientos, newMov];
  }

  onRowAdd() {
    this.addMovimiento();
  }

  onRowDelete(item: any) {
    if (item.id && item.id > 0) {
      this.movimientoService.delete(item.id).subscribe({
        next: () => {
          this.movimientos = this.movimientos.filter((m) => m !== item);
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Movimiento eliminado',
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar',
          });
        },
      });
    } else {
      // Just remove from array if not saved yet
      this.movimientos = this.movimientos.filter((m) => m !== item);
    }
  }

  // Table Edit Handlers
  onRowEditInit(movimiento: MovimientoInventario) {
    const key = movimiento.id ? movimiento.id.toString() : '';
    this.clonedMovimientos[key] = { ...movimiento };
  }

  onRowEditSave(movimiento: MovimientoInventario) {
    // Validate
    if (
      !movimiento.producto ||
      !movimiento.ubicacion ||
      !movimiento.cantidad ||
      !movimiento.tipoMovimiento
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Complete los campos obligatorios',
      });
      return;
    }

    const key = movimiento.id ? movimiento.id.toString() : '';
    if (this.clonedMovimientos[key]) {
      delete this.clonedMovimientos[key];
    }
  }

  onRowEditCancel(event: { data: MovimientoInventario; index: number }) {
    const movimiento = event.data;
    const key = movimiento.id ? movimiento.id.toString() : '';
    if (this.clonedMovimientos[key]) {
      this.movimientos[event.index] = this.clonedMovimientos[key];
      delete this.clonedMovimientos[key];
    }
  }

  cancelar() {
    this.visibleChange.emit(false);
    const returnTo = this.route.snapshot.queryParamMap.get('returnTo');
    if (returnTo) {
      this.router.navigate([returnTo]);
    } else {
      this.router.navigate(['/inventario/movimientos']);
    }
  }

  save() {
    if (this.isSaving) return;

    // Filter valid movements to save
    const movimientosToSave = this.movimientos.filter(
      (m) => m.producto && m.ubicacion && m.cantidad && m.tipoMovimiento,
    );

    if (movimientosToSave.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'No hay movimientos válidos para guardar',
      });
      return;
    }

    this.isSaving = true;
    let completed = 0;
    let errors = 0;
    const total = movimientosToSave.length;

    movimientosToSave.forEach((movimiento) => {
      movimiento.usuario = this.usuarioLogueado.user();

      let request;
      if (movimiento.id && movimiento.id > 0) {
        request = this.movimientoService.update(movimiento);
      } else {
        // Create copy for request with null ID
        const movToSave = { ...movimiento, id: null };
        request = this.movimientoService.create(movToSave);
      }

      request.subscribe({
        next: (savedMov) => {
          Object.assign(movimiento, savedMov);
          completed++;
          this.checkCompletion(completed, errors, total);
        },
        error: (err) => {
          console.error('Error saving movement', err);
          errors++;
          this.checkCompletion(completed, errors, total);
        },
      });
    });
  }

  private checkCompletion(completed: number, errors: number, total: number) {
    if (completed + errors === total) {
      if (errors > 0) {
        this.isSaving = false;
        this.messageService.add({
          severity: 'warn',
          summary: 'Proceso completado',
          detail: `Se guardaron ${completed} movimientos. Hubo ${errors} errores.`,
        });
      } else {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Todos los movimientos se guardaron correctamente',
          life: 1000,
        });

        setTimeout(() => {
          this.saveSuccess.emit();
          this.visibleChange.emit(false);

          const returnTo = this.route.snapshot.queryParamMap.get('returnTo');
          if (returnTo) {
            this.router.navigate([returnTo]);
          } else {
            this.router.navigate(['/inventario/movimientos']);
          }
        }, 1000);
      }
    }
  }
}
