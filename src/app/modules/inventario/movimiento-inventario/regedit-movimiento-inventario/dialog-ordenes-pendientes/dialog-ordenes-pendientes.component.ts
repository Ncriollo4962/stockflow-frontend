import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrdenCompra } from '../../../../../core/models/OrdenCompra';
import { OrdenVenta } from '../../../../../core/models/OrdenVenta';
import { ImportsModule } from '../../../../../imports';
import { Column } from '../../../../shared/components/data-table/data-table.component';
import { MasterDetailTableComponent } from '../../../../shared/components/master-detail-table/master-detail-table.component';
import { EstadoOrdenSeverityPipe } from '../../../../shared/pipes/estado-orden-severity.pipe';

@Component({
  selector: 'app-dialog-ordenes-pendientes',
  standalone: true,
  imports: [ImportsModule, MasterDetailTableComponent],
  templateUrl: './dialog-ordenes-pendientes.component.html',
})
export class DialogOrdenesPendientesComponent {
  private readonly estadoOrdenSeverityPipe = new EstadoOrdenSeverityPipe();

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() loading: boolean = false;
  @Input() ordenesCompra: OrdenCompra[] = [];
  @Input() ordenesVenta: OrdenVenta[] = [];

  @Input() tab: string = 'compras';
  @Output() tabChange = new EventEmitter<string>();

  @Output() seleccionarCompra = new EventEmitter<OrdenCompra>();
  @Output() seleccionarVenta = new EventEmitter<OrdenVenta>();

  ordenCompraCols: Column[] = [
    { field: 'numeroOrden', header: 'N° Orden', type: 'text' },
    { field: 'proveedor.nombre', header: 'Proveedor', type: 'text' },
    { field: 'fechaOrdenCompra', header: 'Fecha Orden', type: 'date' },
    { field: 'fechaEntrega', header: 'Entrega', type: 'date' },
    {
      field: 'estado',
      header: 'Estado',
      type: 'tag',
      tagSeverity: (v) => this.estadoOrdenSeverityPipe.transform(v),
    },
    { field: 'totalCompra', header: 'Total', type: 'currency' },
  ];

  ordenVentaCols: Column[] = [
    { field: 'numeroOrden', header: 'N° Orden', type: 'text' },
    { field: 'clienteNombre', header: 'Cliente', type: 'text' },
    { field: 'fechaVenta', header: 'Fecha Venta', type: 'date' },
    {
      field: 'estado',
      header: 'Estado',
      type: 'tag',
      tagSeverity: (v) => this.estadoOrdenSeverityPipe.transform(v),
    },
    { field: 'totalVenta', header: 'Total', type: 'currency' },
  ];

  detalleCompraCols: Column[] = [
    { field: 'producto.codigo', header: 'Código', type: 'text' },
    { field: 'producto.nombre', header: 'Producto', type: 'text' },
    { field: 'cantidad', header: 'Cantidad', type: 'number' },
    { field: 'precioUnitario', header: 'P. Unitario', type: 'currency' },
    { field: 'subtotal', header: 'Subtotal', type: 'currency' },
  ];

  detalleVentaCols: Column[] = [
    { field: 'producto.codigo', header: 'Código', type: 'text' },
    { field: 'producto.nombre', header: 'Producto', type: 'text' },
    { field: 'cantidad', header: 'Cantidad', type: 'number' },
    { field: 'precioUnitario', header: 'P. Unitario', type: 'currency' },
    { field: 'subtotal', header: 'Subtotal', type: 'currency' },
  ];

  coerceTabValue(value: string | number) {
    console.log('value', value);
    return String(value);
  }

  onCargarOrdenCompra(orden: OrdenCompra) {
    this.seleccionarCompra.emit(orden);
  }

  onCargarOrdenVenta(orden: OrdenVenta) {
    this.seleccionarVenta.emit(orden);
  }
}
