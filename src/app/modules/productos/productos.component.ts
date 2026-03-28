import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ImportsModule } from '../../imports';
import {
  Column,
  DataTableComponent,
} from '../shared/components/data-table/data-table.component';
import { Producto } from '../../core/models/Producto';
import { ProductoService } from '../../core/services/producto.service';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [ImportsModule, DataTableComponent],
  providers: [ConfirmationService],
  templateUrl: './productos.component.html',
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  selectedProductos: Producto[] = [];

  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;

  cols!: Column[];

  private readonly productoService = inject(ProductoService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit() {
    this.loadProductos();
  }

  loadProductos() {
    this.productoService.getProductos().subscribe((data) => {
      this.productos = data || [];
      this.cd.markForCheck();
    });

    this.cols = [
      { field: 'codigo', header: 'Código' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'categoria.nombre', header: 'Categoría' },
      { field: 'precioCosto', header: 'Precio Costo', type: 'currency' },
      { field: 'precioVenta', header: 'Precio Venta', type: 'currency' },
      { field: 'cantidadMinima', header: 'Cant. Mínima', type: 'number' },
      {
        field: 'estado',
        header: 'Estado',
        type: 'tag',
        tagLabel: (value: boolean) => (value ? 'Activo' : 'Inactivo'),
        tagSeverity: (value: boolean) => (value ? 'success' : 'danger'),
      },
    ];
  }

  openNew() {
    this.router.navigate(['newProducto'], { relativeTo: this.route });
  }

  editProducto(producto: Producto) {
    this.router.navigate(['editProducto', producto.id], {
      relativeTo: this.route,
    });
  }

  deleteProducto(producto: Producto) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar el producto ${producto.nombre}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productoService.deleteProducto(producto.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Producto eliminado',
              life: 1000,
            });
            this.loadProductos();
            this.cd.markForCheck();
          },
        });
      },
    });
  }

  deleteSelectedProductos(selected: Producto[]) {
    if (!selected || selected.length === 0) return;

    this.confirmationService.confirm({
      message:
        '¿Estás seguro de que quieres eliminar los ' +
        selected.length +
        ' productos?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productoService
          .deleteMultipleProductos(selected.map((o) => o.id!))
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Productos eliminados',
              detail: 'Todos los productos han sido eliminados',
              life: 1500,
            });
            this.selectedProductos = [];
            this.loadProductos();
          });
      },
    });
  }
}
