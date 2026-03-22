import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Table } from 'primeng/table';
import { ImportsModule } from '../../../../imports';
import { GlobalLoadingService } from '../../../../core/services/global-loading.service';

export interface Column {
  field: string;
  header: string;
  type?: 'text' | 'currency' | 'date' | 'tag' | 'percent' | '%' | 'number';
  style?: Record<string, any> | null;
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
  @Input() dataKey: string = '';
  @Input() globalFilterFields: string[] = [];
  @Input() showGlobalFilter: boolean = true;
  @Input() showSelection: boolean = true;
  @Input() showExportPdf: boolean = false;
  @Input() showExportExcel: boolean = false;
  @Output() exportExcel = new EventEmitter<void>();
  @Output() exportPdf = new EventEmitter<void>();
  @Input() title: string = '';
  @Input() loading: boolean = false;
  globalLoading = inject(GlobalLoadingService).isLoading;
  @Input() rows: number = 10;
  @Input() paginator: boolean = true;
  @Input() showCurrentPageReport: boolean = true;
  @Input() currentPageReportTemplate: string =
    'Mostrando {first} a {last} de {totalRecords} registros';

  @Input() showCreate: boolean = true;
  @Input() showEdit: boolean = true;
  @Input() showDelete: boolean = true;

  @Input() rowClass: ((rowData: any) => any) | null = null;
  @Input() rowStyle: ((rowData: any) => Record<string, any> | null) | null =
    null;

  @Input() cellClass: ((rowData: any, col: Column, value: any) => any) | null =
    null;
  @Input() cellStyle:
    | ((rowData: any, col: Column, value: any) => Record<string, any> | null)
    | null = null;

  @Output() selectionChange = new EventEmitter<any[] | null>();
  @Output() shouldonCreate = new EventEmitter<void>();
  @Output() shouldonEdit = new EventEmitter<any>();
  @Output() shouldonDelete = new EventEmitter<any>();
  @Output() shouldonDeleteSelected = new EventEmitter<any[]>();

  @ViewChild('dt') dt: Table | undefined;

  getNormalizedColStyle(col: Column): Record<string, any> | null {
    const style = col.style ?? null;
    if (!style) return null;

    const width = style['width'] ?? style['max-width'] ?? style['min-width'];
    if (!width) return style;

    return {
      ...style,
      'min-width': style['min-width'] ?? width,
      'max-width': style['max-width'] ?? width,
      width: style['width'] ?? width,
    };
  }

  onSelectionChange(value: any[] | null) {
    this.selection = value;
    this.selectionChange.emit(value);
  }

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

  onExportExcel() {
    this.exportExcel.emit();
  }
  onExportPdf() {
    this.exportPdf.emit();
  }
}
