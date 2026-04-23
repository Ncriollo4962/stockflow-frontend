import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InventarioItem } from '../../../core/models/InventarioItem';
import { InventarioItemService } from '../../../core/services/inventario-item.service';
import { ImportsModule } from '../../../imports';
import {
  Column,
  DataTableComponent,
} from '../../shared/components/data-table/data-table.component';
import { ActivatedRoute, Router } from '@angular/router';

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-inventario-item',
  standalone: true,
  imports: [ImportsModule, DataTableComponent],
  providers: [ConfirmationService],
  templateUrl: './inventario-item.component.html',
})
export class InventarioItemComponent implements OnInit {
  inventarioItems: InventarioItem[] = [];
  selectedItems: InventarioItem[] = [];

  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;

  cols!: Column[];
  exportColumns!: ExportColumn[];

  private readonly inventarioService = inject(InventarioItemService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit() {
    this.loadInventario();

    this.cols = [
      { field: 'producto.nombre', header: 'Producto' },
      { field: 'ubicacion.nombre', header: 'Ubicación' },
      // { field: 'lote', header: 'Lote' },
      // { field: 'fechaVencimiento', header: 'Vencimiento', type: 'date' },
      { field: 'cantidad', header: 'Stock' },
      { field: 'cantidadReservada', header: 'Cantidad Reservada' },
      {
        field: 'fechaUltimoConteo',
        header: 'Fecha Último Conteo',
        type: 'date',
      },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  loadInventario() {
    this.inventarioService.getAll().subscribe({
      next: (data) => {
        this.inventarioItems = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el inventario',
        });
      },
    });
  }

  openNew() {
    this.router.navigate(['movimientos/new'], {
      relativeTo: this.route,
      queryParams: { returnTo: '/inventario' },
    });
  }

  editItem(item: InventarioItem) {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Funcionalidad de editar item pendiente',
    });
  }

  deleteItem(item: InventarioItem) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este item de inventario?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (item.id) {
          this.inventarioService.delete(item.id).subscribe({
            next: () => {
              this.inventarioItems = this.inventarioItems.filter(
                (val) => val.id !== item.id,
              );
              this.messageService.add({
                severity: 'success',
                summary: 'Exitoso',
                detail: 'Item eliminado',
                life: 3000,
              });
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo eliminar el item',
              });
            },
          });
        }
      },
    });
  }

  deleteSelectedItems(selected: InventarioItem[]) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar los items seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Implementar eliminación múltiple si el backend lo soporta
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Funcionalidad de eliminación múltiple pendiente',
        });
      },
    });
  }
}
