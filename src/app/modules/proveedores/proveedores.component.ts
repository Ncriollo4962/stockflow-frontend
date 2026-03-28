import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ImportsModule } from '../../imports';
import {
  Column,
  DataTableComponent,
} from '../shared/components/data-table/data-table.component';
import { Proveedor } from '../../core/models/Proveedor';
import { ProveedorService } from '../../core/services/proveedor.service';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [ImportsModule, DataTableComponent],
  providers: [ConfirmationService],
  templateUrl: './proveedores.component.html',
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  selectedProveedores: Proveedor[] = [];

  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;

  cols!: Column[];

  private readonly proveedorService = inject(ProveedorService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit() {
    this.loadProveedores();
  }

  loadProveedores() {
    this.proveedorService.getProveedores().subscribe((data) => {
      this.proveedores = data || [];
      this.cd.markForCheck();
    });

    this.cols = [
      { field: 'codigo', header: 'Código' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'contacto', header: 'Contacto' },
      { field: 'email', header: 'Email' },
      { field: 'telefono', header: 'Teléfono' },
      { field: 'ciudadPais', header: 'Ciudad/País' },
      {
        field: 'estado',
        header: 'Estado',
        type: 'tag',
        tagLabel: (value: boolean) => (value ? 'Activo' : 'Inactivo'),
        tagSeverity: (value: boolean) => (value ? 'success' : 'danger'),
      },
    ];
  }

  openNew() {
    this.router.navigate(['newProveedor'], { relativeTo: this.route });
  }

  editProveedor(proveedor: Proveedor) {
    this.router.navigate(['editProveedor', proveedor.id], {
      relativeTo: this.route,
    });
  }

  deleteProveedor(proveedor: Proveedor) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar al proveedor ${proveedor.nombre}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.proveedorService.deleteProveedor(proveedor.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Proveedor eliminado',
              life: 1000,
            });
            this.loadProveedores();
            this.cd.markForCheck();
          },
        });
      },
    });
  }

  deleteSelectedProveedores(selected: Proveedor[]) {
    if (!selected || selected.length === 0) return;

    this.confirmationService.confirm({
      message:
        '¿Estás seguro de que quieres eliminar los ' +
        selected.length +
        ' proveedores?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.proveedorService
          .deleteMultipleProveedores(selected.map((o) => o.id!))
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Proveedores eliminados',
              detail: 'Todos los proveedores han sido eliminados',
              life: 1500,
            });
            this.selectedProveedores = [];
            this.loadProveedores();
          });
      },
    });
  }
}
