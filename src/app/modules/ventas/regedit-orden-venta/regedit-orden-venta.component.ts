import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DetalleOrdenVentaComponent } from '../detalle-orden-venta/detalle-orden-venta.component';
import { ImportsModule } from '../../../imports';
import { OrdenVenta } from '../../../core/models/OrdenVenta';
import { OrdenVentaService } from '../../../core/services/orden-venta.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { listEstadosOrdenVenta } from '../../shared/enums/estados-orden';

@Component({
  selector: 'app-regedit-orden-venta',
  standalone: true,
  imports: [ImportsModule, DatePipe, DetalleOrdenVentaComponent],
  templateUrl: './regedit-orden-venta.component.html',
})
export class RegeditOrdenVentaComponent implements OnInit {
  /* -------------------------------------------------------------------------- */
  /*                                 VARIABLES                                  */
  /* -------------------------------------------------------------------------- */
  estadosOrden = listEstadosOrdenVenta;
  form: FormGroup = {} as FormGroup;
  idOrdenVenta: number | null = null;
  editOrdenVenta: OrdenVenta = new OrdenVenta();
  initialFormState: string = '{}';
  initialDetallesState: string = '[]';
  @ViewChild(DetalleOrdenVentaComponent)
  detalleComponent!: DetalleOrdenVentaComponent;

  /* -------------------------------------------------------------------------- */
  /*                                 CONSTRUCTOR                                */
  /* -------------------------------------------------------------------------- */
  fb = inject(FormBuilder);
  ordenVentaService = inject(OrdenVentaService);
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

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.idOrdenVenta = +id;
        this.loadOrdenVenta(this.idOrdenVenta);
      } else {
        this.generateNroOrden();
      }
    });
  }

  loadOrdenVenta(id: number) {
    this.ordenVentaService.getOrdenVentaById(id).subscribe({
      next: (orden) => {
        this.editOrdenVenta = orden;
        if (this.detalleComponent) {
          const detalles = orden.detallesOrdenVenta || [];
          detalles.forEach((detalle, index) => {
            detalle.nroItemTemp = index + 1;
          });
          this.detalleComponent.detallesOrdenVenta = detalles;

          this.initialDetallesState = JSON.stringify(
            this.detalleComponent.detallesOrdenVenta,
          );
        }
        this.form.patchValue({
          numeroOrden: orden.numeroOrden,
          estado: orden.estado,
          clienteNombre: orden.clienteNombre,
          clienteEmail: orden.clienteEmail,
          clienteTelefono: orden.clienteTelefono,
          direccion: orden.direccion,
          fechaVenta: orden.fechaVenta ? new Date(orden.fechaVenta) : null,
          totalVenta: orden.totalVenta,
        });

        this.initialFormState = JSON.stringify(this.form.getRawValue());
        this.updateButtonState();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la orden de venta',
        });
        this.router.navigate(['/ventas']);
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                 FORMULARIO                                 */
  /* -------------------------------------------------------------------------- */
  createForm() {
    this.form = this.fb.group({
      numeroOrden: [{ value: '', disabled: true }, [Validators.required]],
      estado: ['', [Validators.required]],
      clienteNombre: ['', [Validators.required]],
      clienteEmail: ['', [Validators.email]],
      clienteTelefono: [''],
      direccion: [''],
      fechaVenta: [new Date(), [Validators.required]],
      totalVenta: [{ value: 0, disabled: true }],
    });

    this.initialFormState = JSON.stringify(this.form.getRawValue());
    this.initialDetallesState = '[]';

    this.watchFormChanges();
    this.updateButtonState();
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
    const currentFormState = JSON.stringify(this.form.getRawValue());
    const formChanged = currentFormState !== this.initialFormState;

    let detailsChanged = false;
    if (this.detalleComponent) {
      const currentDetailsState = JSON.stringify(
        this.detalleComponent.detallesOrdenVenta,
      );
      detailsChanged = currentDetailsState !== this.initialDetallesState;
    }

    const total = this.form.getRawValue().totalVenta || 0;
    this.btnSaveDisabled =
      this.form.invalid || total < 0 || (!formChanged && !detailsChanged);
  }

  onDetallesChanged() {
    this.updateButtonState();
  }

  actualizarTotalVenta(total: number) {
    this.form.patchValue({ totalVenta: total });
    this.form.markAsDirty();
  }

  /* -------------------------------------------------------------------------- */
  /*                            GENERAR NRO DE ORDEN                            */
  /* -------------------------------------------------------------------------- */
  generateNroOrden() {
    this.ordenVentaService.generateNumber().subscribe((data) => {
      this.form.patchValue({ numeroOrden: data });
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                            PROCESO_ORDEN_VENTA                             */
  /* -------------------------------------------------------------------------- */
  guardarOrden() {
    if (this.form.valid) {
      const ordenVenta = this.form.getRawValue() as OrdenVenta;
      ordenVenta.usuario = this.usuarioLogueado.user();

      if (this.detalleComponent) {
        ordenVenta.detallesOrdenVenta =
          this.detalleComponent.detallesOrdenVenta;
      }

      let request;
      if (this.idOrdenVenta) {
        ordenVenta.id = this.idOrdenVenta;
        ordenVenta.version = this.editOrdenVenta.version;
        request = this.ordenVentaService.updateOrdenVenta(ordenVenta);
      } else {
        request = this.ordenVentaService.createOrdenVenta(ordenVenta);
      }

      request.subscribe({
        next: (response) => {
          this.editOrdenVenta = response;

          const isNewOrden = !this.idOrdenVenta;

          if (isNewOrden) {
            this.idOrdenVenta = response.id;
            // Navegar a modo edición
            this.router.navigate(['/ventas/editOrdenVenta', response.id], {
              replaceUrl: true,
            });
          }
          this.form.patchValue({
            numeroOrden: response.numeroOrden,
            estado: response.estado,
            clienteNombre: response.clienteNombre,
            clienteEmail: response.clienteEmail,
            clienteTelefono: response.clienteTelefono,
            direccion: response.direccion,
            fechaVenta: response.fechaVenta
              ? new Date(response.fechaVenta)
              : null,
            totalVenta: response.totalVenta,
          });

          // Marcar como 'pristine' para que el botón se deshabilite hasta que haya nuevos cambios
          this.form.markAsPristine();

          // Actualizar estados iniciales para la detección de cambios
          this.initialFormState = JSON.stringify(this.form.getRawValue());
          if (this.detalleComponent) {
            this.initialDetallesState = JSON.stringify(
              this.detalleComponent.detallesOrdenVenta,
            );
          }

          this.updateButtonState();

          this.messageService.add({
            severity: 'success',
            summary: isNewOrden
              ? 'Orden de Venta Registrada'
              : 'Orden de Venta Actualizada',
            detail: `Número de Orden: ${response.numeroOrden}`,
            life: 3000,
          });
        },
        error: (error) => {
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
    this.router.navigate(['/ventas']);
  }
}
