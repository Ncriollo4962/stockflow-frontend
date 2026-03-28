import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ImportsModule } from '../../../imports';
import { Proveedor } from '../../../core/models/Proveedor';
import { ProveedorService } from '../../../core/services/proveedor.service';

@Component({
  selector: 'app-regedit-proveedor',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './regedit-proveedor.component.html',
})
export class RegeditProveedorComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  proveedorId: number | null = null;
  btnSaveDisabled = false;
  editProveedor: Proveedor = new Proveedor();

  private readonly fb = inject(FormBuilder);
  private readonly proveedorService = inject(ProveedorService);
  private readonly messageService = inject(MessageService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    this.createForm();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const idParam = params['id'];
      if (idParam) {
        this.isEditMode = true;
        this.proveedorId = +idParam;
        this.loadProveedor(this.proveedorId);
      } else {
        this.isEditMode = false;
        this.proveedorId = null;
        this.btnSaveDisabled = false;
        this.form.reset({
          codigo: '',
          nombre: '',
          contacto: '',
          email: '',
          telefono: '',
          direccion: '',
          ciudadPais: '',
          estado: true,
        });
        this.cd.markForCheck();
      }
    });
  }

  createForm() {
    this.form = this.fb.group({
      codigo: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      contacto: [''],
      email: ['', [Validators.email]],
      telefono: [''],
      direccion: [''],
      ciudadPais: [''],
      estado: [true],
    });
  }

  loadProveedor(id: number) {
    this.proveedorService.getProveedorById(id).subscribe({
      next: (proveedor) => {
        this.editProveedor = proveedor;
        this.form.patchValue({
          codigo: proveedor.codigo ?? '',
          nombre: proveedor.nombre ?? '',
          contacto: proveedor.contacto ?? '',
          email: proveedor.email ?? '',
          telefono: proveedor.telefono ?? '',
          direccion: proveedor.direccion ?? '',
          ciudadPais: proveedor.ciudadPais ?? '',
          estado: proveedor.estado ?? true,
        });
        this.cd.markForCheck();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error?.titulo || 'Error',
          detail:
            error.error?.mensaje ||
            error.message ||
            'No se pudo cargar el proveedor',
          life: 3000,
        });
        this.router.navigate(['/proveedores']);
      },
    });
  }

  guardarProveedor() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.btnSaveDisabled = true;
    const proveedor = this.form.getRawValue() as Proveedor;

    let request;
    if (this.isEditMode) {
      proveedor.id = this.editProveedor.id;
      proveedor.version = this.editProveedor.version;
      request = this.proveedorService.updateProveedor(proveedor);
    } else {
      request = this.proveedorService.createProveedor(proveedor);
    }

    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Proveedor ${
            this.isEditMode ? 'actualizado' : 'creado'
          } correctamente`,
          life: 1000,
        });
        setTimeout(() => {
          this.router.navigate(['/proveedores']);
        }, 1000);
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
        this.btnSaveDisabled = false;
      },
    });
  }

  cancelar() {
    this.router.navigate(['/proveedores']);
  }
}
