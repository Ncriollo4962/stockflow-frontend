import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ImportsModule } from '../../imports';
import {
  Column,
  DataTableComponent,
} from '../shared/components/data-table/data-table.component';
import { Categoria } from '../../core/models/Categoria';
import { CategoriaService } from '../../core/services/categoria.service';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [ImportsModule, DataTableComponent],
  providers: [ConfirmationService],
  templateUrl: './categorias.component.html',
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  selectedCategorias: Categoria[] = [];

  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;

  cols!: Column[];

  private readonly categoriaService = inject(CategoriaService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit() {
    this.loadCategorias();
  }

  loadCategorias() {
    this.categoriaService.getAll().subscribe((data) => {
      this.categorias = data || [];
      this.cd.markForCheck();
    });

    this.cols = [
      { field: 'codigo', header: 'Código' },
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
    this.router.navigate(['newCategoria'], { relativeTo: this.route });
  }

  editCategoria(categoria: Categoria) {
    this.router.navigate(['editCategoria', categoria.id], {
      relativeTo: this.route,
    });
  }

  deleteCategoria(categoria: Categoria) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar la categoría ${categoria.nombre}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriaService.delete(categoria.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Categoría eliminada',
              life: 1000,
            });
            this.loadCategorias();
            this.cd.markForCheck();
          },
        });
      },
    });
  }

  deleteSelectedCategorias(selected: Categoria[]) {
    if (!selected || selected.length === 0) return;

    this.confirmationService.confirm({
      message:
        '¿Estás seguro de que quieres eliminar las ' + selected.length + ' categorías?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriaService.deleteMultiple(selected.map((o) => o.id!)).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Categorías eliminadas',
            detail: 'Todas las categorías han sido eliminadas',
            life: 1500,
          });
          this.selectedCategorias = [];
          this.loadCategorias();
        });
      },
    });
  }
}
