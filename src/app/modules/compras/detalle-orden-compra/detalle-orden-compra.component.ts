import {
  ChangeDetectorRef,
  Component,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DetalleOrdenCompra } from '../../../core/models/DetalleOrdenCompra';
import { ImportsModule } from '../../../imports';
import {
  Column,
  DataTableComponent,
} from '../../shared/components/data-table/data-table.component';
import { DialogDetalleOrdenCompraComponent } from './dialog-detalle-orden-compra/dialog-detalle-orden-compra.component';

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-detalle-orden-compra',
  imports: [
    ImportsModule,
    DialogDetalleOrdenCompraComponent,
    DataTableComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './detalle-orden-compra.component.html',
})
export class DetalleOrdenCompraComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTableComponent!: DataTableComponent;
  @ViewChild('dialogDetalle') dialogDetalle!: DialogDetalleOrdenCompraComponent;

  detalleOrdenCompraDialog: boolean = false;

  detallesOrdenCompra: DetalleOrdenCompra[] = [];
  detalleOrdenCompra!: DetalleOrdenCompra;
  selectedDetallesOc: DetalleOrdenCompra[] | null = null;
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
    this.nroItemTemp = this.detallesOrdenCompra.length + 1;
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
    console.log('editProduct', detalle);
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

  agregarDetalleTabla(newDetalle: DetalleOrdenCompra) {
    const index = this.detallesOrdenCompra.findIndex(
      (p) => p.nroItemTemp === newDetalle.nroItemTemp,
    );

    if (index === -1) {
      this.detallesOrdenCompra = [...this.detallesOrdenCompra, newDetalle];
    } else {
      this.detallesOrdenCompra[index] = newDetalle;
      this.detallesOrdenCompra = [...this.detallesOrdenCompra];
    }

    this.cd.markForCheck();
    this.calcularYEmitirTotal();
  }

  hideDialog() {
    this.detalleOrdenCompraDialog = false;
    this.submitted = false;
  }

  renumerarDetalles() {
    this.detallesOrdenCompra.forEach((detalle, index) => {
      detalle.nroItemTemp = index + 1;
    });
  }

  deleteProduct(detalle: DetalleOrdenCompra) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' + detalle.producto?.nombre + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.detallesOrdenCompra = this.detallesOrdenCompra.filter(
          (val) => val.nroItemTemp !== detalle.nroItemTemp,
        );
        this.detalleOrdenCompra = {} as DetalleOrdenCompra;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Detalle Deleted',
          life: 3000,
        });
        this.selectedDetallesOc = null;
        this.renumerarDetalles();
        this.calcularYEmitirTotal();
      },
    });
  }

  deleteAllProduct(selection: DetalleOrdenCompra[]) {
    console.log('deleteAllProduct', selection);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete all products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.detallesOrdenCompra = this.detallesOrdenCompra.filter(
          (val) => !selection.includes(val),
        );
        this.detalleOrdenCompra = {} as DetalleOrdenCompra;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000,
        });
        this.selectedDetallesOc = null;
        this.renumerarDetalles();
        this.calcularYEmitirTotal();
      },
    });
  }

  saveProduct() {
    this.submitted = true;
  }

  private calcularYEmitirTotal() {
    const total = this.detallesOrdenCompra.reduce(
      (acc, el) => acc + (el.subtotal || 0),
      0,
    );
    this.totalCalculado.emit(total);
    this.detallesChanged.emit();
  }
}
