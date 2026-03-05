import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Table } from 'primeng/table';
import { ImportsModule } from '../../../../imports';

export interface Column {
  field: string;
  header: string;
  type?: 'text' | 'currency' | 'date' | 'tag';
  tagSeverity?: (
    value: any,
  ) =>
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | undefined;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './data-table.component.html',
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() cols: Column[] = [];
  @Input() selection: any[] | null = [];
  @Input() dataKey: string = 'id';
  @Input() globalFilterFields: string[] = [];
  @Input() title: string = '';
  @Input() loading: boolean = false;
  @Input() rows: number = 10;
  @Input() paginator: boolean = true;
  @Input() showCurrentPageReport: boolean = true;
  @Input() currentPageReportTemplate: string =
    'Mostrando {first} a {last} de {totalRecords} registros';

  @Output() selectionChange = new EventEmitter<any[] | null>();
  @Output() shouldonCreate = new EventEmitter<void>();
  @Output() shouldonEdit = new EventEmitter<any>();
  @Output() shouldonDelete = new EventEmitter<any>();
  @Output() shouldonDeleteSelected = new EventEmitter<any[]>();

  @ViewChild('dt') dt: Table | undefined;

  onSelectionChange(value: any[] | null) {
    this.selection = value;
    this.selectionChange.emit(value);
  }

  // Función auxiliar para obtener valores anidados (ej: 'producto.nombre')
  getFieldValue(rowData: any, field: string): any {
    if (!rowData) return '';
    const fields = field.split('.');
    let value = rowData;
    for (const f of fields) {
      value = value?.[f];
    }
    return value;
  }

  deleteSelected() {
    if (this.selection && this.selection.length > 0) {
      this.shouldonDeleteSelected.emit(this.selection);
    }
  }
}
