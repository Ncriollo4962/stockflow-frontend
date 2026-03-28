import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ImportsModule } from '../../../imports';
import { Usuario } from '../../../core/models/Usuario';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-regedit-usuario',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './regedit-usuario.component.html',
})
export class RegeditUsuarioComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  usuarioId: number | null = null;
  btnSaveDisabled = false;
  editUsuario: Usuario = new Usuario();

  rolesList = [
    { label: 'Administrador TI', value: 'ROLE_ADMIN_TI' },
    { label: 'Gerente Almacen', value: 'ROLE_GERENTE_ALMACEN' },
    { label: 'Almacenero', value: 'ROLE_ALMACENERO' },
    { label: 'Vendedor', value: 'ROLE_VENDEDOR' },
    { label: 'Asistente', value: 'ROLE_ASISTENTE' },
  ];

  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly messageService = inject(MessageService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    this.createForm();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const idParam = params['id'];
      if (idParam) {
        this.isEditMode = true;
        this.usuarioId = +idParam;
        this.loadUsuario(this.usuarioId);
        const passwordControl = this.form.get('contrasena');
        passwordControl?.clearValidators();
        passwordControl?.updateValueAndValidity();
      } else {
        this.isEditMode = false;
        this.usuarioId = null;
        this.btnSaveDisabled = false;
        this.form.reset({
          id: null,
          codigo: '',
          nombre: '',
          email: '',
          contrasena: '',
          rol: '',
          estado: true,
        });
        const passwordControl = this.form.get('contrasena');
        passwordControl?.setValidators([Validators.required]);
        passwordControl?.updateValueAndValidity();
        this.cd.markForCheck();
      }
    });
  }

  createForm() {
    this.form = this.fb.group({
      codigo: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]],
      rol: ['', [Validators.required]],
      estado: [true],
    });
  }

  loadUsuario(id: number) {
    this.usuarioService.getUsuarioById(id).subscribe({
      next: (usuario) => {
        this.editUsuario = usuario;
        this.form.patchValue(usuario);
        this.form.get('contrasena')?.setValue('');
        this.cd.markForCheck();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el usuario',
        });
        this.router.navigate(['/usuarios']);
      },
    });
  }

  guardarUsuario() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.btnSaveDisabled = true;
    const usuario = this.form.getRawValue() as Usuario;
    if (this.isEditMode && !usuario.contrasena) {
      delete (usuario as any).contrasena;
    }

    let request;
    if (this.isEditMode) {
      usuario.id = this.editUsuario.id;
      usuario.version = this.editUsuario.version;
      request = this.usuarioService.updateUsuario(usuario);
    } else {
      request = this.usuarioService.createUsuario(usuario);
    }

    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Usuario ${
            this.isEditMode ? 'actualizado' : 'creado'
          } correctamente`,
          life: 1000,
        });
        setTimeout(() => {
          this.router.navigate(['/usuarios']);
        }, 1000);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error?.titulo || 'Error al Guardar',
          detail:
            error.error?.mensaje ||
            error.message ||
            'Por favor, intente nuevamente.',
          life: 3000,
        });
        this.btnSaveDisabled = false;
      },
    });
  }

  cancelar() {
    this.router.navigate(['/usuarios']);
  }
}
