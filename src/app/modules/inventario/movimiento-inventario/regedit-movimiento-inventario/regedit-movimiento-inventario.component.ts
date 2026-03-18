import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
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
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { MovimientoInventario } from '../../../../core/models/MovimientoInventario';
import { OrdenCompra } from '../../../../core/models/OrdenCompra';
import { OrdenVenta } from '../../../../core/models/OrdenVenta';
import { MovimientoInventarioService } from '../../../../core/services/movimiento-inventario.service';
import { OrdenCompraService } from '../../../../core/services/orden-compra.service';
import { OrdenVentaService } from '../../../../core/services/orden-venta.service';
import { ProductoService } from '../../../../core/services/producto.service';
import { UbicacionService } from '../../../../core/services/ubicacion.service';
import { ImportsModule } from '../../../../imports';
import {
  EditableColumn,
  EditableTableComponent,
} from '../../../../modules/shared/components/editable-table/editable-table.component';
import {
  EstadosMovInventario,
  listEstadosMovInventario,
  listEstadosMovInventarioMes,
} from '../../../shared/enums/estados-inventario';
import { DialogOrdenesPendientesComponent } from './dialog-ordenes-pendientes/dialog-ordenes-pendientes.component';

@Component({
  selector: 'app-regedit-movimiento-inventario',
  standalone: true,
  imports: [
    ImportsModule,
    EditableTableComponent,
    DialogOrdenesPendientesComponent,
  ],
  providers: [DatePipe],
  templateUrl: './regedit-movimiento-inventario.component.html',
})
export class RegeditMovimientoInventarioComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saveSuccess = new EventEmitter<void>();

  movimientos: MovimientoInventario[] = [];
  clonedMovimientos: { [s: string]: MovimientoInventario } = {};
  isSaving: boolean = false;
  ordenesCompraPendientes: OrdenCompra[] = [];
  ordenesVentaPendientes: OrdenVenta[] = [];
  ordenesDialogVisible: boolean = false;
  ordenesDialogLoading: boolean = false;
  ordenesDialogTab: string = 'compras';
  listEstadosMovInventario: string[] = [];
  showBuscarOrdenes: boolean = false;
  nroItemTemp: number = 0;

  fb = inject(FormBuilder);
  movimientoService = inject(MovimientoInventarioService);
  productoService = inject(ProductoService);
  ubicacionService = inject(UbicacionService);
  usuarioLogueado = inject(AuthService);
  messageService = inject(MessageService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  ordenCompraService = inject(OrdenCompraService);
  ordenVentaService = inject(OrdenVentaService);
  datePipe = inject(DatePipe);

  productsRx = rxResource({
    loader: () => this.productoService.getProductos(),
  });
  ubicacionesRx = rxResource({
    loader: () => this.ubicacionService.getAll(),
  });

  productos = computed(() => {
    return this.productsRx.value() || [];
  });

  ubicaciones = computed(() => {
    return this.ubicacionesRx.value() || [];
  });

  movimientoCols = computed<EditableColumn[]>(() => {
    const p = this.productos();
    const u = this.ubicaciones();
    const returnTo = this.route.snapshot.queryParamMap.get('returnTo');
    console.log('returnTo', returnTo);
    const estados = returnTo
      ? listEstadosMovInventarioMes
      : listEstadosMovInventario;
    this.showBuscarOrdenes = !returnTo;

    return [
      {
        field: 'producto',
        header: 'Producto',
        type: 'select',
        options: p,
        optionLabel: 'nombre',
        required: true,
        style: 'min-width: 150px',
      },
      {
        field: 'ubicacion',
        header: 'Ubicación',
        type: 'select',
        options: u,
        optionLabel: 'nombre',
        required: true,
        style: 'min-width: 150px',
      },
      {
        field: 'tipoMovimiento',
        header: 'Tipo Movimiento',
        type: 'select',
        options: estados.map((e) => ({
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

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadMovimiento(+id);
      } else {
        this.addMovimiento();
      }
    });
  }

  loadMovimiento(id: number) {
    this.movimientoService.getById(id).subscribe({
      next: (movimiento) => {
        const parsed = movimiento?.fechaMovimiento
          ? new Date(movimiento.fechaMovimiento as any)
          : null;
        const formatted =
          parsed && !Number.isNaN(parsed.getTime())
            ? this.datePipe.transform(parsed, 'dd/MM/yyyy')
            : null;
        this.movimientos = [
          {
            ...movimiento,
            fechaMovimiento: formatted ?? movimiento.fechaMovimiento,
          },
        ];
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
    newMov.nroItemTemp = ++this.nroItemTemp;
    const now = new Date();
    newMov.fechaMovimiento = this.datePipe.transform(now, 'dd/MM/yyyy');
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
      this.movimientos = this.movimientos.filter((m) => m !== item);
    }
  }

  onRowEditInit(movimiento: MovimientoInventario) {
    const key = movimiento.nroItemTemp?.toString() || '';
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

    const key = movimiento.nroItemTemp?.toString() || '';
    if (this.clonedMovimientos[key]) {
      delete this.clonedMovimientos[key];
    }
  }

  onRowEditCancel(event: { data: MovimientoInventario; index: number }) {
    const movimiento = event.data;
    const key = movimiento.nroItemTemp?.toString() || '';
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
        const movToSave = { ...movimiento };
        movToSave.fechaMovimiento = this.toBackendFechaMovimiento(
          movToSave.fechaMovimiento,
        );
        request = this.movimientoService.update(movToSave);
      } else {
        const movToSave = { ...movimiento, id: null };
        movToSave.fechaMovimiento = this.toBackendFechaMovimiento(
          movToSave.fechaMovimiento,
        );
        request = this.movimientoService.create(movToSave);
      }

      request.subscribe({
        next: (savedMov) => {
          Object.assign(movimiento, savedMov);
          movimiento.fechaMovimiento = this.toDisplayFechaMovimiento(
            movimiento.fechaMovimiento,
          );
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

  private toBackendFechaMovimiento(
    value: string | null | undefined,
  ): string | null {
    if (!value) return null;
    const parts = value.split('/');
    if (parts.length !== 3) return value;

    const day = Number(parts[0]);
    const month = Number(parts[1]);
    const yearRaw = Number(parts[2]);
    const year = parts[2].length === 2 ? 2000 + yearRaw : yearRaw;

    const date = new Date(year, month - 1, day, 0, 0, 0);
    if (Number.isNaN(date.getTime())) return value;
    return this.datePipe.transform(date, "yyyy-MM-dd'T'HH:mm:ss");
  }

  private toDisplayFechaMovimiento(value: any): string | null {
    if (!value) return null;
    if (typeof value !== 'string') return value;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return this.datePipe.transform(date, 'dd/MM/yyyy') ?? value;
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

  buscarOrdenes() {
    this.ordenesDialogVisible = true;
    this.ordenesDialogLoading = true;

    forkJoin({
      compras: this.ordenCompraService.getPendientesRecepcion(),
      ventas: this.ordenVentaService.getPendientesDespacho(),
    }).subscribe({
      next: ({ compras, ventas }) => {
        console.log('Órdenes de compra pendientes:', compras);
        console.log('Órdenes de venta pendientes:', ventas);
        this.ordenesCompraPendientes = compras ?? [];
        this.ordenesVentaPendientes = ventas ?? [];
        this.ordenesDialogTab =
          this.ordenesCompraPendientes.length > 0 ? 'compras' : 'ventas';
        this.ordenesDialogLoading = false;
      },
      error: () => {
        this.ordenesDialogLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron obtener las órdenes pendientes',
        });
      },
    });
  }

  seleccionarOrdenCompra(orden: OrdenCompra) {
    const id = orden?.id;
    if (!id) return;

    this.ordenesDialogLoading = true;
    this.ordenCompraService.getOrdenCompraById(id).subscribe({
      next: (oc) => {
        this.cargarMovimientosDesdeCompra(oc);
        this.ordenesDialogVisible = false;
        this.ordenesDialogLoading = false;
      },
      error: () => {
        this.ordenesDialogLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el detalle de la orden de compra',
        });
      },
    });
  }

  seleccionarOrdenVenta(orden: OrdenVenta) {
    const id = orden?.id;
    if (!id) return;

    this.ordenesDialogLoading = true;
    this.ordenVentaService.getOrdenVentaById(id).subscribe({
      next: (ov) => {
        this.cargarMovimientosDesdeVenta(ov);
        this.ordenesDialogVisible = false;
        this.ordenesDialogLoading = false;
      },
      error: () => {
        this.ordenesDialogLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el detalle de la orden de venta',
        });
      },
    });
  }

  private cargarMovimientosDesdeCompra(oc: OrdenCompra) {
    const detalles = oc.detallesOrdenCompra ?? [];
    const movimientosNuevos = detalles
      .filter((d) => d?.producto && d?.cantidad)
      .map((d) => {
        const m = new MovimientoInventario();
        m.nroItemTemp = ++this.nroItemTemp;
        m.producto = d.producto;
        m.cantidad = d.cantidad;
        m.tipoMovimiento = EstadosMovInventario.ENTRADA;
        m.motivo = 'Recepción de Orden de Compra';
        m.referencia = oc.numeroOrden;
        m.fechaMovimiento = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
        m.notas = oc.notas;
        return m;
      });

    if (movimientosNuevos.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'La orden no tiene detalles para generar movimientos',
      });
      return;
    }

    if (this.deberiaReemplazarMovimientos()) {
      this.movimientos = movimientosNuevos;
    } else {
      this.movimientos = [...this.movimientos, ...movimientosNuevos];
    }
  }

  private cargarMovimientosDesdeVenta(ov: OrdenVenta) {
    const detalles = ov.detallesOrdenVenta ?? [];
    const movimientosNuevos = detalles
      .filter((d) => d?.producto && d?.cantidad)
      .map((d) => {
        const m = new MovimientoInventario();
        m.nroItemTemp = ++this.nroItemTemp;
        m.producto = d.producto;
        m.cantidad = d.cantidad;
        m.tipoMovimiento = EstadosMovInventario.SALIDA;
        m.motivo = 'Despacho de Orden de Venta';
        m.referencia = ov.numeroOrden;
        m.fechaMovimiento = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
        return m;
      });

    if (movimientosNuevos.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'La orden no tiene detalles para generar movimientos',
      });
      return;
    }

    if (this.deberiaReemplazarMovimientos()) {
      this.movimientos = movimientosNuevos;
    } else {
      this.movimientos = [...this.movimientos, ...movimientosNuevos];
    }
  }

  private deberiaReemplazarMovimientos(): boolean {
    if (this.movimientos.length !== 1) return false;
    const m = this.movimientos[0];
    return (
      !m?.producto &&
      !m?.ubicacion &&
      !m?.cantidad &&
      !m?.tipoMovimiento &&
      !m?.motivo &&
      !m?.referencia
    );
  }
}
