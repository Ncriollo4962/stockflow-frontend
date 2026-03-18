import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { Column } from '../data-table/data-table.component';

@Component({
  selector: 'app-master-detail-table',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './master-detail-table.component.html',
})
export class MasterDetailTableComponent {
  @Input() data: any[] = [];
  @Input() cols: Column[] = [];
  @Input() detailsCols: Column[] = [];
  @Input() detailsField: string = '';

  @Input() dataKey: string = 'id';
  @Input() globalFilterFields: string[] = [];
  @Input() showGlobalFilter: boolean = true;

  @Input() loading: boolean = false;
  @Input() rows: number = 10;
  @Input() paginator: boolean = true;

  @Input() actionLabel: string = 'Cargar';
  @Input() actionIcon: string = 'pi pi-check';
  @Input() actionSeverity: string = 'success';
  @Input() actionDisabled: boolean = false;

  @Output() rowAction = new EventEmitter<any>();

  expandedRowKeys: Record<string, boolean> = {};

  getFieldValue(rowData: any, field: string): any {
    if (!rowData) return '';
    const fields = field.split('.');
    let value = rowData;
    for (const f of fields) {
      value = value?.[f];
    }
    return value;
  }

  getDetails(rowData: any): any[] {
    if (!rowData || !this.detailsField) return [];
    const val = (rowData as any)?.[this.detailsField];
    return Array.isArray(val) ? val : [];
  }

  toggleRow(rowData: any) {
    const key = this.getRowKey(rowData);
    if (!key) return;

    const isExpanded = !!this.expandedRowKeys[key];
    this.expandedRowKeys = isExpanded ? {} : { [key]: true };
  }

  onAction(rowData: any) {
    this.rowAction.emit(rowData);
  }

  private getRowKey(rowData: any): string | null {
    const keyVal = this.getFieldValue(rowData, this.dataKey);
    if (keyVal === null || keyVal === undefined) return null;
    return String(keyVal);
  }
}
