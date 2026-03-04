import { Component, inject, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Select } from 'primeng/select';
import { Categoria } from '../../../../core/models/Categoria';
import { DetalleOrdenCompra } from '../../../../core/models/DetalleOrdenCompra';
import { Producto } from '../../../../core/models/Producto';
import { ImportsModule } from '../../../../imports';

@Component({
  selector: 'app-dialog-detalle-orden-compra',
  imports: [ImportsModule, Select],
  templateUrl: './dialog-detalle-orden-compra.component.html',
})
export class DialogDetalleOrdenCompraComponent implements OnInit {
  shouldNewDetalle = output<DetalleOrdenCompra>();

  productDialog: boolean = false;
  products!: Producto[];
  product!: Producto;
  selectedProducts!: Producto[] | null;
  submitted: boolean = false;
  statuses!: any[];
  detalle!: DetalleOrdenCompra;

  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  public detalleForm!: FormGroup;

  ngOnInit() {
    this.initForm();
    this.products = [
      {
        id: 1,
        codigo: 'LAPGAM123',
        nombre: 'Laptop Gamer',
        descripcion: 'Laptop con GPU dedicada para juegos',
        precioCosto: 1200,
        precioVenta: 1500,
        cantidadMinima: 10,
        estado: true,
        version: 1,
        categoria: {
          id: 1,
          nombre: 'Electrónica',
          descripcion: 'Equipos electrónicos',
          estado: true,
          version: 1,
        } as Categoria,
      },
      {
        id: 2,
        codigo: 'MOUSEIN123',
        nombre: 'Mouse Inalámbrico',
        descripcion: 'Mouse inalámbrico para juegos',
        precioCosto: 20,
        precioVenta: 25,
        cantidadMinima: 20,
        estado: true,
        version: 1,
        categoria: {
          id: 1,
          nombre: 'Electrónica',
          descripcion: 'Equipos electrónicos',
          estado: true,
          version: 1,
        } as Categoria,
      },
      {
        id: 3,
        codigo: 'KEYMEC123',
        nombre: 'Teclado Mecánico',
        descripcion: 'Teclado mecánico para escritorio',
        precioCosto: 40,
        precioVenta: 80,
        cantidadMinima: 30,
        estado: true,
        version: 1,
        categoria: {
          id: 1,
          nombre: 'Electrónica',
          descripcion: 'Equipos electrónicos',
          estado: true,
          version: 1,
        } as Categoria,
      },
      {
        id: 4,
        codigo: 'MON24123',
        nombre: 'Monitor 24"',
        descripcion: 'Monitor de 24 pulgadas Full HD',
        precioCosto: 150,
        precioVenta: 200,
        cantidadMinima: 15,
        estado: true,
        version: 1,
        categoria: {
          id: 1,
          nombre: 'Electrónica',
          descripcion: 'Equipos electrónicos',
          estado: true,
          version: 1,
        } as Categoria,
      },
    ];
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

  onProductoSelect(event: Producto) {
    const prod = event;
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
        id: rawValue.id || null, // Usar ID existente o generar nuevo
        nroItemTemp: rawValue.nroItemTemp || null,
        ordenCompra: null,
        producto: productoSeleccionado,
        cantidad: rawValue.cantidad,
        precioUnitario: rawValue.precioUnitario,
        subtotal: rawValue.subtotal,
      };
      this.shouldNewDetalle.emit(this.detalle);
      this.hideDialog();
      this.detalleForm.reset({ cantidad: 1, precioUnitario: 0, id: null });
    }
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }
}
