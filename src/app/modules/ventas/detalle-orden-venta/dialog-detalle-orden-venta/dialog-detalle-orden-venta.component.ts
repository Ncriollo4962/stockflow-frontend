import {
  Component,
  computed,
  inject,
  OnInit,
  output,
  Signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select } from 'primeng/select';
import { DetalleOrdenVenta } from '../../../../core/models/DetalleOrdenVenta';
import { Producto } from '../../../../core/models/Producto';
import { ImportsModule } from '../../../../imports';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductoService } from '../../../../core/services/producto.service';

@Component({
  selector: 'app-dialog-detalle-orden-venta',
  standalone: true,
  imports: [ImportsModule, Select],
  templateUrl: './dialog-detalle-orden-venta.component.html',
})
export class DialogDetalleOrdenVentaComponent implements OnInit {
  shouldNewDetalle = output<DetalleOrdenVenta>();

  productDialog: boolean = false;
  products!: Signal<Producto[]>;
  product!: Producto;
  selectedProducts!: Producto[] | null;
  submitted: boolean = false;
  statuses!: any[];
  detalle!: DetalleOrdenVenta;
  detalleForm!: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductoService);

  productsRx = rxResource({
    loader: () => this.productService.getProductos(),
  });

  ngOnInit() {
    this.initForm();

    this.products = computed(() => {
      return this.productsRx.value() || [];
    });

    this.watchChanges();
  }

  private initForm() {
    this.detalleForm = this.fb.group({
      id: [null],
      nroItemTemp: [null],
      producto: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0)]],
      subtotal: [{ value: 0, disabled: true }], // Solo lectura
    });
  }

  private watchChanges() {
    this.detalleForm.valueChanges.subscribe((values) => {
      const cantidad = values.cantidad || 0;
      const precio = values.precioUnitario || 0;
      const subtotal = cantidad * precio;

      this.detalleForm
        .get('subtotal')
        ?.setValue(subtotal, { emitEvent: false });
    });
  }

  onProductoSelect(event: any) {
    const prod = event.value;
    if (prod) {
      this.detalleForm.patchValue({
        precioUnitario: prod.precioVenta || 0,
      });
    }
  }

  agregarDetalle() {
    if (this.detalleForm.valid) {
      const rawValue = this.detalleForm.getRawValue();
      const productoSeleccionado = rawValue.producto;

      this.detalle = {
        id: rawValue.id || null,
        nroItemTemp: rawValue.nroItemTemp || null,
        ordenVenta: null,
        producto: productoSeleccionado,
        cantidad: rawValue.cantidad,
        precioUnitario: rawValue.precioUnitario,
        subtotal: rawValue.cantidad * rawValue.precioUnitario,
      };
      this.shouldNewDetalle.emit(this.detalle);
      this.hideDialog();
      this.detalleForm.reset({ cantidad: 1, precioUnitario: 0, id: null });
    } else {
      this.detalleForm.markAllAsTouched();
    }
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }
}
