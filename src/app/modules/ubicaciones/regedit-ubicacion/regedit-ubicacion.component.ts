import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ImportsModule } from '../../../imports';
import { Ubicacion } from '../../../core/models/Ubicacion';
import { UbicacionService } from '../../../core/services/ubicacion.service';

@Component({
  selector: 'app-regedit-ubicacion',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './regedit-ubicacion.component.html',
})
export class RegeditUbicacionComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  ubicacionId: number | null = null;
  btnSaveDisabled = false;
  editUbicacion: Ubicacion = new Ubicacion();

  private readonly fb = inject(FormBuilder);
  private readonly ubicacionService = inject(UbicacionService);
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
        this.ubicacionId = +idParam;
        this.loadUbicacion(this.ubicacionId);
      } else {
        this.isEditMode = false;
        this.ubicacionId = null;
        this.btnSaveDisabled = false;
        this.form.reset({
          codigo: '',
          nombre: '',
          descripcion: '',
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
      descripcion: [''],
      estado: [true],
    });
  }

  loadUbicacion(id: number) {
    this.ubicacionService.getById(id).subscribe({
      next: (ubicacion) => {
        this.editUbicacion = ubicacion;
        this.form.patchValue(ubicacion);
        this.cd.markForCheck();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error?.titulo || 'Error',
          detail:
            error.error?.mensaje ||
            error.message ||
            'No se pudo cargar la ubicación',
          life: 3000,
        });
        this.router.navigate(['/ubicaciones']);
      },
    });
  }

  guardarUbicacion() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.btnSaveDisabled = true;
    const ubicacion = this.form.getRawValue() as Ubicacion;

    let request;
    if (this.isEditMode) {
      ubicacion.id = this.editUbicacion.id;
      ubicacion.version = this.editUbicacion.version;
      request = this.ubicacionService.update(ubicacion);
    } else {
      request = this.ubicacionService.create(ubicacion);
    }

    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Ubicación ${
            this.isEditMode ? 'actualizada' : 'creada'
          } correctamente`,
          life: 1000,
        });
        setTimeout(() => {
          this.router.navigate(['/ubicaciones']);
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
    this.router.navigate(['/ubicaciones']);
  }
}
