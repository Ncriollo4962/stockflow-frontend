import {
  ChangeDetectorRef,
  Component,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

import { DialogDetalleOrdenVentaComponent } from './dialog-detalle-orden-venta/dialog-detalle-orden-venta.component';
import { ImportsModule } from '../../../imports';
import {
  Column,
  DataTableComponent,
} from '../../shared/components/data-table/data-table.component';
import { DetalleOrdenVenta } from '../../../core/models/DetalleOrdenVenta';

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-detalle-orden-venta',
  standalone: true,
  imports: [
    ImportsModule,
    DialogDetalleOrdenVentaComponent,
    DataTableComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './detalle-orden-venta.component.html',
})
export class DetalleOrdenVentaComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTableComponent!: DataTableComponent;
  @ViewChild('dialogDetalle') dialogDetalle!: DialogDetalleOrdenVentaComponent;

  detalleOrdenVentaDialog: boolean = false;

  detallesOrdenVenta: DetalleOrdenVenta[] = [];
  detalleOrdenVenta!: DetalleOrdenVenta;
  selectedDetallesOv: DetalleOrdenVenta[] | null = null;
  submitted: boolean = false;
  nroItemTemp: number = 0;

  totalCalculado = output<number>();
  detallesChanged = output<void>();

  cols!: Column[];

  exportColumns!: ExportColumn[];
  globalFilterFields!: string[];

  constructor(
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly cd: ChangeDetectorRef,
  ) {}

  exportCSV() {
    this.dataTableComponent.dt?.exportCSV();
  }

  ngOnInit() {
    this.loadDemoData();
  }

  loadDemoData() {
    // Inicializamos las columnas dinámicas
    this.cols = [
      { field: 'nroItemTemp', header: 'NroItem' },
      { field: 'producto.nombre', header: 'Producto' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'precioUnitario', header: 'Precio Unitario', type: 'currency' },
      { field: 'subtotal', header: 'Subtotal', type: 'currency' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));

    this.globalFilterFields = this.cols.map((col) => col.field);
  }

  calcularNroItemTemp() {
    this.nroItemTemp = this.detallesOrdenVenta.length + 1;
  }

  openNew() {
    this.calcularNroItemTemp();
    this.dialogDetalle.productDialog = true;
    this.dialogDetalle.submitted = false;
    this.dialogDetalle.detalleForm.reset();
    this.dialogDetalle.detalleForm
      .get('nroItemTemp')
      ?.setValue(this.nroItemTemp);
  }

  editProduct(detalle: any) {
    this.dialogDetalle.detalleForm.patchValue({
      id: detalle.id,
      nroItemTemp: detalle.nroItemTemp,
      producto: detalle.producto,
      cantidad: detalle.cantidad,
      precioUnitario: detalle.precioUnitario,
      subtotal: detalle.subtotal,
    });
    this.dialogDetalle.productDialog = true;
  }

  agregarDetalleTabla(newDetalle: DetalleOrdenVenta) {
    const index = this.detallesOrdenVenta.findIndex(
      (p) => p.nroItemTemp === newDetalle.nroItemTemp,
    );

    if (index === -1) {
      this.detallesOrdenVenta = [...this.detallesOrdenVenta, newDetalle];
    } else {
      this.detallesOrdenVenta[index] = newDetalle;
      this.detallesOrdenVenta = [...this.detallesOrdenVenta];
    }

    this.cd.markForCheck();
    this.calcularYEmitirTotal();
  }

  hideDialog() {
    this.detalleOrdenVentaDialog = false;
    this.submitted = false;
  }

  renumerarDetalles() {
    this.detallesOrdenVenta.forEach((detalle, index) => {
      detalle.nroItemTemp = index + 1;
    });
  }

  deleteProduct(detalle: DetalleOrdenVenta) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar ' + detalle.producto?.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.detallesOrdenVenta = this.detallesOrdenVenta.filter(
          (val) => val.nroItemTemp !== detalle.nroItemTemp,
        );
        this.detalleOrdenVenta = {} as DetalleOrdenVenta;
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Detalle Eliminado',
          life: 3000,
        });
        this.selectedDetallesOv = null;
        this.renumerarDetalles();
        this.calcularYEmitirTotal();
      },
    });
  }

  deleteAllProduct(selection: DetalleOrdenVenta[]) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar todos los productos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.detallesOrdenVenta = this.detallesOrdenVenta.filter(
          (val) => !selection.includes(val),
        );
        this.detalleOrdenVenta = {} as DetalleOrdenVenta;
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Productos Eliminados',
          life: 3000,
        });
        this.selectedDetallesOv = null;
        this.renumerarDetalles();
        this.calcularYEmitirTotal();
      },
    });
  }

  saveProduct() {
    this.submitted = true;
  }

  private calcularYEmitirTotal() {
    const total = this.detallesOrdenVenta.reduce(
      (acc, el) => acc + (el.subtotal || 0),
      0,
    );
    this.totalCalculado.emit(total);
    this.detallesChanged.emit();
  }
}
