import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ImportsModule } from '../../imports';
import {
  Column,
  DataTableComponent,
} from '../shared/components/data-table/data-table.component';
import { Ubicacion } from '../../core/models/Ubicacion';
import { UbicacionService } from '../../core/services/ubicacion.service';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-ubicaciones',
  standalone: true,
  imports: [ImportsModule, DataTableComponent],
  providers: [ConfirmationService],
  templateUrl: './ubicaciones.component.html',
})
export class UbicacionesComponent implements OnInit {
  ubicaciones: Ubicacion[] = [];
  selectedUbicaciones: Ubicacion[] = [];

  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;

  cols!: Column[];

  private readonly ubicacionService = inject(UbicacionService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit() {
    this.loadUbicaciones();
  }

  loadUbicaciones() {
    this.ubicacionService.getAll().subscribe((data) => {
      this.ubicaciones = data || [];
      this.cd.markForCheck();
    });

    this.cols = [
      { field: 'codigo', header: 'Código', style: { width: '100px' } },
      { field: 'nombre', header: 'Nombre' },
      { field: 'descripcion', header: 'Descripción' },
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
    this.router.navigate(['newUbicacion'], { relativeTo: this.route });
  }

  editUbicacion(ubicacion: Ubicacion) {
    this.router.navigate(['editUbicacion', ubicacion.id], {
      relativeTo: this.route,
    });
  }

  deleteUbicacion(ubicacion: Ubicacion) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar la ubicación ${ubicacion.nombre}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ubicacionService.delete(ubicacion.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Ubicación eliminada',
              life: 1000,
            });
            this.loadUbicaciones();
            this.cd.markForCheck();
          },
        });
      },
    });
  }

  deleteSelectedUbicaciones(selected: Ubicacion[]) {
    if (!selected || selected.length === 0) return;

    this.confirmationService.confirm({
      message:
        '¿Estás seguro de que quieres eliminar las ' +
        selected.length +
        ' ubicaciones?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ubicacionService
          .deleteMultiple(selected.map((o) => o.id!))
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Ubicaciones eliminadas',
              detail: 'Todas las ubicaciones han sido eliminadas',
              life: 1500,
            });
            this.selectedUbicaciones = [];
            this.loadUbicaciones();
          });
      },
    });
  }
}
