import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsuarioService } from '../../core/services/usuario.service';
import { ImportsModule } from '../../imports';
import {
  Column,
  DataTableComponent,
} from '../shared/components/data-table/data-table.component';
import { Usuario } from '../../core/models/Usuario2';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [ImportsModule, DataTableComponent],
  providers: [ConfirmationService],
  templateUrl: './usuarios.component.html',
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = []; // Usamos Usuario2[] para tipar correctamente
  selectedUsuarios: Usuario[] = [];

  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;

  cols!: Column[];
  exportColumns!: any[];

  private readonly usuarioService = inject(UsuarioService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit() {
    this.initColumns();
    this.loadUsuarios();
  }

  private initColumns() {
    this.cols = [
      { field: 'codigo', header: 'Código' },
      { field: 'nombre', header: 'Nombre Completo' },
      { field: 'email', header: 'Email' },
      { field: 'rolesDisplay', header: 'Roles' }, // Campo transformado
      {
        field: 'estado',
        header: 'Estado',
        type: 'tag',
        tagSeverity: (value: boolean) => (value ? 'success' : 'danger'),
      },
      { field: 'fechaCreacion', header: 'F. Creación', type: 'date' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  loadUsuarios() {
    this.usuarioService.getUsuarios().subscribe((data) => {
      // Transformamos los datos para que 'roles' sea un texto legible antes de llegar a la tabla
      this.usuarios = data.map((u) => ({
        ...u,
        //rolesDisplay: u.roles?.join(', ') || 'Sin Rol', // Pisamos 'roles' con el string ya formateado
      }));
      this.cd.markForCheck();
    });

    this.cols = [
      { field: 'codigo', header: 'Código' },
      { field: 'nombre', header: 'Nombre Completo' },
      { field: 'email', header: 'Email' },
      { field: 'rol', header: 'Roles' }, // Ahora esto es un string, no un array
      {
        field: 'estado',
        header: 'Estado',
        type: 'tag',
        tagSeverity: (value: boolean) => (value ? 'success' : 'danger'),
      },
    ];
  }

  // --- Métodos de Acción ---

  openNew() {
    this.router.navigate(['newUsuario'], { relativeTo: this.route });
  }

  editUsuario(usuario: Usuario) {
    this.router.navigate(['editUsuario', usuario.id], {
      relativeTo: this.route,
    });
  }

  deleteUsuario(usuario: Usuario) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar al usuario ${usuario.nombre}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usuarioService.deleteUsuario(usuario.id!).subscribe({
          next: () => {
            this.usuarios = this.usuarios.filter((u) => u.id !== usuario.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Usuario Eliminado',
              life: 3000,
            });
            this.cd.markForCheck();
          },
        });
      },
    });
  }
}
