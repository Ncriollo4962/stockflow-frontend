import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  ViewChild,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/auth/services/auth.service';
import { OrdenCompra } from '../../../core/models/OrdenCompra';
import { Proveedor } from '../../../core/models/Proveedor';
import { OrdenCompraService } from '../../../core/services/orden-compra.service';
import { ProveedorService } from '../../../core/services/proveedor.service';
import { ImportsModule } from '../../../imports';
import { listEstadosOrden } from '../../shared/enums/estados-orden';
import { DetalleOrdenCompraComponent } from '../detalle-orden-compra/detalle-orden-compra.component';

@Component({
  selector: 'app-regedit-orden-compra',
  imports: [ImportsModule, DatePipe, DetalleOrdenCompraComponent],
  templateUrl: './regedit-orden-compra.component.html',
})
export class RegeditOrdenCompraComponent implements OnInit {
  /* -------------------------------------------------------------------------- */
  /*                                 VARIABLES                                  */
  /* -------------------------------------------------------------------------- */
  proveedores!: Signal<Proveedor[]>;
  estadosOrden = listEstadosOrden;
  form: FormGroup = {} as FormGroup;
  idOrdenCompra: number | null = null;
  editOrdenCompra: OrdenCompra = new OrdenCompra();
  @ViewChild(DetalleOrdenCompraComponent)
  detalleComponent!: DetalleOrdenCompraComponent;

  /* -------------------------------------------------------------------------- */
  /*                                 CONSTRUCTOR                                */
  /* -------------------------------------------------------------------------- */
  fb = inject(FormBuilder);
  proveedorService = inject(ProveedorService);
  ordenCompraService = inject(OrdenCompraService);
  usuarioLogueado = inject(AuthService);
  messageService = inject(MessageService);
  btnSaveDisabled: boolean = true;
  route = inject(ActivatedRoute);
  router = inject(Router);

  /* -------------------------------------------------------------------------- */
  /*                                 CICLOS DE VIDA                             */
  /* -------------------------------------------------------------------------- */

  ngOnInit() {
    this.createForm();

    this.proveedores = computed(() => {
      return this.proveedoresRx.value() || [];
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.idOrdenCompra = +id;
        this.loadOrdenCompra(this.idOrdenCompra);
      }
    });
  }

  loadOrdenCompra(id: number) {
    this.ordenCompraService.getOrdenCompraById(id).subscribe({
      next: (orden) => {
        this.editOrdenCompra = orden;
        if (this.detalleComponent) {
          this.detalleComponent.detallesOrdenCompra =
            orden.detallesOrdenCompra || [];
        }
        this.form.patchValue({
          numeroOrden: orden.numeroOrden,
          estado: orden.estado,
          proveedor: orden.proveedor,
          fechaOrdenCompra: orden.fechaOrdenCompra
            ? new Date(orden.fechaOrdenCompra)
            : null,
          fechaEntrega: orden.fechaEntrega
            ? new Date(orden.fechaEntrega)
            : null,
          fechaCreacion: orden.fechaCreacion
            ? new Date(orden.fechaCreacion)
            : null,
          totalCompra: orden.totalCompra,
          notas: orden.notas,
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la orden de compra',
        });
        this.router.navigate(['/compras']);
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                 FORMULARIO                                 */
  /* -------------------------------------------------------------------------- */
  createForm() {
    this.form = this.fb.group({
      numeroOrden: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      proveedor: [null, [Validators.required]],
      fechaOrdenCompra: [new Date(), [Validators.required]],
      fechaEntrega: [null],
      fechaCreacion: [{ value: new Date(), disabled: true }],
      totalCompra: [{ value: 0, disabled: true }],
      notas: [''],
    });

    this.watchFormChanges();
  }

  private watchFormChanges() {
    this.form.valueChanges.subscribe(() => {
      this.updateButtonState();
    });

    this.form.statusChanges.subscribe(() => {
      this.updateButtonState();
    });
  }

  private updateButtonState() {
    const total = this.form.getRawValue().totalCompra || 0;
    this.btnSaveDisabled = this.form.invalid || total < 0 || this.form.pristine;
  }

  actualizarTotalCompra(total: number) {
    this.form.patchValue({ totalCompra: total });
    this.form.markAsDirty();
  }

  /* -------------------------------------------------------------------------- */
  /*                                  PROVEEDORES                               */
  /* -------------------------------------------------------------------------- */

  proveedoresRx = rxResource({
    loader: () => this.proveedorService.getProveedores(),
  });

  /* -------------------------------------------------------------------------- */
  /*                            PROCESO_ORDEN_COMPRA                            */
  /* -------------------------------------------------------------------------- */
  guardarOrden() {
    if (this.form.valid) {
      const ordenCompra = this.form.getRawValue() as OrdenCompra;
      ordenCompra.usuario = this.usuarioLogueado.user();

      if (this.detalleComponent) {
        ordenCompra.detallesOrdenCompra =
          this.detalleComponent.detallesOrdenCompra;
      }

      let request;
      if (this.idOrdenCompra) {
        ordenCompra.id = this.idOrdenCompra;
        ordenCompra.version = this.editOrdenCompra.version;
        request = this.ordenCompraService.updateOrdenCompra(ordenCompra);
      } else {
        request = this.ordenCompraService.createOrdenCompra(ordenCompra);
      }

      request.subscribe({
        next: (response) => {
          console.log('Orden de Compra guardada:', response);
          const isNewOrden = !this.idOrdenCompra;

          if (isNewOrden) {
            this.idOrdenCompra = response.id;
            // Navegar a modo edición
            this.router.navigate(['/compras/editOrdenCompra', response.id], {
              replaceUrl: true,
            });
          }

          this.form.patchValue({
            numeroOrden: response.numeroOrden,
            estado: response.estado,
            proveedor: response.proveedor,
            fechaOrdenCompra: response.fechaOrdenCompra
              ? new Date(response.fechaOrdenCompra)
              : null,
            fechaEntrega: response.fechaEntrega
              ? new Date(response.fechaEntrega)
              : null,
            fechaCreacion: response.fechaCreacion
              ? new Date(response.fechaCreacion)
              : null,
            totalCompra: response.totalCompra,
            usuario: response.usuario,
            notas: response.notas,
          });

          // Marcar como 'pristine' para que el botón se deshabilite hasta que haya nuevos cambios
          this.form.markAsPristine();
          this.updateButtonState();

          this.messageService.add({
            severity: 'success',
            summary: isNewOrden
              ? 'Orden de Compra Registrada'
              : 'Orden de Compra Actualizada',
            detail: `Número de Orden: ${response.numeroOrden}`,
            life: 3000,
          });
        },
        error: (error) => {
          console.error('Error al guardar la Orden de Compra:', error);
          this.messageService.add({
            severity: 'error',
            summary: error.error?.titulo || 'Error al Guardar',
            detail:
              error.error?.mensaje ||
              error.message ||
              'Por favor, intente nuevamente.',
            life: 3000,
          });
        },
      });
    }
  }

  cancelarOrden() {
    this.router.navigate(['/compras']);
  }
}
