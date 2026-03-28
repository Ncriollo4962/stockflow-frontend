import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ImportsModule } from '../../../imports';
import { Categoria } from '../../../core/models/Categoria';
import { CategoriaService } from '../../../core/services/categoria.service';

@Component({
  selector: 'app-regedit-categoria',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './regedit-categoria.component.html',
})
export class RegeditCategoriaComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  categoriaId: number | null = null;
  btnSaveDisabled = false;
  editCategoria: Categoria = new Categoria();

  private readonly fb = inject(FormBuilder);
  private readonly categoriaService = inject(CategoriaService);
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
        this.categoriaId = +idParam;
        this.loadCategoria(this.categoriaId);
      } else {
        this.isEditMode = false;
        this.categoriaId = null;
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

  loadCategoria(id: number) {
    this.categoriaService.getById(id).subscribe({
      next: (categoria) => {
        this.editCategoria = categoria;
        this.form.patchValue(categoria);
        this.cd.markForCheck();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error?.titulo || 'Error',
          detail:
            error.error?.mensaje ||
            error.message ||
            'No se pudo cargar la categoría',
          life: 3000,
        });
        this.router.navigate(['/categorias']);
      },
    });
  }

  guardarCategoria() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.btnSaveDisabled = true;
    const categoria = this.form.getRawValue() as Categoria;

    let request;
    if (this.isEditMode) {
      categoria.id = this.editCategoria.id;
      categoria.version = this.editCategoria.version;
      request = this.categoriaService.update(categoria);
    } else {
      request = this.categoriaService.create(categoria);
    }

    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Categoría ${
            this.isEditMode ? 'actualizada' : 'creada'
          } correctamente`,
          life: 1000,
        });
        setTimeout(() => {
          this.router.navigate(['/categorias']);
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
    this.router.navigate(['/categorias']);
  }
}
