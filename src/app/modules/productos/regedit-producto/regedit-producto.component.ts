import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ImportsModule } from '../../../imports';
import { Producto } from '../../../core/models/Producto';
import { ProductoService } from '../../../core/services/producto.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../core/models/Categoria';

@Component({
  selector: 'app-regedit-producto',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './regedit-producto.component.html',
})
export class RegeditProductoComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  productoId: number | null = null;
  btnSaveDisabled = false;
  editProducto: Producto = new Producto();

  categoriasList: Categoria[] = [];

  private readonly fb = inject(FormBuilder);
  private readonly productoService = inject(ProductoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly messageService = inject(MessageService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    this.createForm();
  }

  ngOnInit() {
    this.loadCategorias();

    this.route.params.subscribe((params) => {
      const idParam = params['id'];
      if (idParam) {
        this.isEditMode = true;
        this.productoId = +idParam;
        this.loadProducto(this.productoId);
      } else {
        this.isEditMode = false;
        this.productoId = null;
        this.btnSaveDisabled = false;
        this.form.reset({
          codigo: '',
          nombre: '',
          descripcion: '',
          categoriaId: null,
          precioCosto: 0,
          precioVenta: 0,
          cantidadMinima: 0,
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
      categoriaId: [null, [Validators.required]],
      precioCosto: [0, [Validators.required, Validators.min(0)]],
      precioVenta: [0, [Validators.required, Validators.min(0)]],
      cantidadMinima: [0, [Validators.required, Validators.min(0)]],
      estado: [true],
    });
  }

  loadCategorias() {
    this.categoriaService.getAll().subscribe({
      next: (categorias) => {
        this.categoriasList = categorias || [];
        this.cd.markForCheck();
      },
      error: () => {
        this.categoriasList = [];
        this.cd.markForCheck();
      },
    });
  }

  loadProducto(id: number) {
    this.productoService.getProductoById(id).subscribe({
      next: (producto) => {
        this.editProducto = producto;
        this.form.patchValue({
          codigo: producto.codigo ?? '',
          nombre: producto.nombre ?? '',
          descripcion: producto.descripcion ?? '',
          categoriaId: producto.categoria?.id ?? null,
          precioCosto: producto.precioCosto ?? 0,
          precioVenta: producto.precioVenta ?? 0,
          cantidadMinima: producto.cantidadMinima ?? 0,
          estado: producto.estado ?? true,
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
            'No se pudo cargar el producto',
          life: 3000,
        });
        this.router.navigate(['/productos']);
      },
    });
  }

  guardarProducto() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.btnSaveDisabled = true;
    const rawValue = this.form.getRawValue() as {
      codigo: string;
      nombre: string;
      descripcion: string;
      categoriaId: number;
      precioCosto: number;
      precioVenta: number;
      cantidadMinima: number;
      estado: boolean;
    };

    const categoria: Categoria = {
      id: rawValue.categoriaId,
      codigo: null,
      nombre: null,
      descripcion: null,
      estado: null,
      version: null,
    };

    const producto: Producto = {
      id: null,
      codigo: rawValue.codigo,
      nombre: rawValue.nombre,
      descripcion: rawValue.descripcion,
      precioCosto: rawValue.precioCosto,
      precioVenta: rawValue.precioVenta,
      cantidadMinima: rawValue.cantidadMinima,
      estado: rawValue.estado,
      version: null,
      categoria,
    };

    let request;
    if (this.isEditMode) {
      producto.id = this.editProducto.id;
      producto.version = this.editProducto.version;
      request = this.productoService.updateProducto(producto);
    } else {
      request = this.productoService.createProducto(producto);
    }

    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Producto ${
            this.isEditMode ? 'actualizado' : 'creado'
          } correctamente`,
          life: 1000,
        });
        setTimeout(() => {
          this.router.navigate(['/productos']);
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
    this.router.navigate(['/productos']);
  }
}
