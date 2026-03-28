import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsuarioService } from '../../core/services/usuario.service';
import { ImportsModule } from '../../imports';
import {
  Column,
  DataTableComponent,
} from '../shared/components/data-table/data-table.component';
import { Usuario } from '../../core/models/Usuario';
import { RolUsuarioLabelPipe } from '../shared/pipes/rol-usuario-label.pipe';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';

type UsuarioRow = Usuario & { rolLabel?: string };

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [ImportsModule, DataTableComponent],
  providers: [ConfirmationService],
  templateUrl: './usuarios.component.html',
})
export class UsuariosComponent implements OnInit {
  usuarios: UsuarioRow[] = [];
  selectedUsuarios: UsuarioRow[] = [];

  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;

  cols!: Column[];
  exportColumns!: any[];

  private readonly usuarioService = inject(UsuarioService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly rolUsuarioLabelPipe = new RolUsuarioLabelPipe();

  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.usuarioService.getUsuarios().subscribe((data) => {
      this.usuarios = data.map((u) => ({
        ...u,
        rolLabel: this.rolUsuarioLabelPipe.transform(u.rol),
      }));
      this.cd.markForCheck();
    });

    this.cols = [
      { field: 'codigo', header: 'Código' },
      { field: 'nombre', header: 'Nombre Completo' },
      { field: 'email', header: 'Email' },
      { field: 'rolLabel', header: 'Roles' },
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
              life: 1000,
            });
            this.loadUsuarios();
            this.cd.markForCheck();
          },
        });
      },
    });
  }

  deleteSelectedUsuarios(selected: Usuario[]) {
    if (selected && selected.length > 0) {
      this.confirmationService.confirm({
        message:
          '¿Estás seguro de que quieres eliminar los ' +
          selected.length +
          ' usuarios?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.usuarioService
            .deleteMultipleUsuarios(selected.map((o) => o.id!))
            .subscribe(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'Usuarios eliminados',
                detail: 'Todos los usuarios han sido eliminados',
                life: 1500,
              });
              this.selectedUsuarios = [];
              this.loadUsuarios();
            });
        },
      });
    }
  }
}
