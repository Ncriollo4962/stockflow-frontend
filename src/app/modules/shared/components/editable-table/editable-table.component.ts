import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { CalendarModule } from 'primeng/calendar';
import { Dialog } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { EstadoInventarioSeverityPipe } from '../../pipes/estado-inventario-severity.pipe';

export interface EditableColumn {
  field: string;
  header: string;
  type: 'text' | 'number' | 'select' | 'currency' | 'boolean' | 'date';
  options?: any[];
  optionLabel?: string;
  optionValue?: string;
  required?: boolean;
  style?: string;
  showTag?: boolean;
}

@Component({
  selector: 'app-editable-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    ButtonModule,
    TagModule,
    SelectModule,
    CalendarModule,
    Dialog,
    DatePickerModule,
    EstadoInventarioSeverityPipe,
  ],
  templateUrl: './editable-table.component.html',
  styles: [],
})
export class EditableTableComponent {
  @Input() data: any[] = [];
  @Input() cols: EditableColumn[] = [];
  @Input() dataKey: string = 'id';
  @Input() tableStyle: any = { 'min-width': '50rem' };
  @Input() header: string = 'Header';

  @Output() rowEditInit = new EventEmitter<any>();
  @Output() rowEditSave = new EventEmitter<any>();
  @Output() rowEditCancel = new EventEmitter<{ data: any; index: number }>();
  @Output() rowAdd = new EventEmitter<void>();
  @Output() rowDelete = new EventEmitter<any>();
  @Output() buscarOrdenes = new EventEmitter<void>();

  @Input() dialogVisible: boolean = false;
  @Output() dialogVisibleChange = new EventEmitter<boolean>();

  getDisplayValue(rowData: any, col: EditableColumn): any {
    const val = rowData[col.field];
    if (val === null || val === undefined) {
      return '';
    }
    if (col.type === 'select') {
      const optionLabel = col.optionLabel || 'label';
      // Case 1: Value is an object
      if (val && typeof val === 'object') {
        // 1.1 Try configured label property
        if (val[optionLabel]) return val[optionLabel];

        // 1.2 If object is incomplete (e.g. has ID but no name), try to find full object in options
        if (val.id && col.options) {
          const match = col.options.find((opt) => opt.id === val.id);
          if (match && match[optionLabel]) {
            return match[optionLabel];
          }
        }

        // 1.3 Fallbacks comunes
        if (val.nombre) return val.nombre;
        if (val.label) return val.label;
        if (val.name) return val.name;
        if (val.descripcion) return val.descripcion;
        if (val.codigo) return val.codigo;

        // 1.4 Debug fallback
        return JSON.stringify(val);
      }
      if (col.options && col.optionValue) {
        const optionValue = col.optionValue;
        const match = col.options.find((opt) => opt[optionValue] == val);
        if (match) {
          return match[optionLabel];
        }
      }
    }
    return val;
  }

  onRowEditInit(item: any) {
    this.rowEditInit.emit(item);
  }

  onRowEditSave(item: any) {
    this.rowEditSave.emit(item);
  }

  onRowEditCancel(item: any, index: number) {
    this.rowEditCancel.emit({ data: item, index });
  }

  onRowAdd() {
    this.rowAdd.emit();
  }

  onRowDelete(item: any) {
    this.rowDelete.emit(item);
  }

  onBuscarOrdenesEmit() {
    this.buscarOrdenes.emit();
  }
}
