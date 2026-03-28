import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ImportsModule } from '../../../imports';
import { Usuario } from '../../../core/models/Usuario2';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-regedit-usuario',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './regedit-usuario.component.html',
})
export class RegeditUsuarioComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  usuarioId: number | null = null;
  btnSaveDisabled = false;

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
    this.form = this.fb.group({
      id: [null],
      codigo: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]],
      rol: ['', [Validators.required]],
      estado: [true],
      version: [0],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.usuarioId = +params['id'];
        this.loadUsuario(this.usuarioId);
        // Si es edición, la contraseña no es obligatoria a menos que se quiera cambiar
        this.form.get('contraseña')?.clearValidators();
        this.form.get('contraseña')?.updateValueAndValidity();
      }
    });
  }

  loadUsuario(id: number) {
    this.usuarioService.getUsuarioById(id).subscribe({
      next: (usuario) => {
        this.form.patchValue(usuario);
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
    const usuario: Usuario = this.form.value;
    console.log(this.form.get('rol')?.value);
    console.log(usuario);
    const request = this.isEditMode
      ? this.usuarioService.updateUsuario(usuario)
      : this.usuarioService.createUsuario(usuario);

    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Usuario ${
            this.isEditMode ? 'actualizado' : 'creado'
          } correctamente`,
        });
        this.router.navigate(['/usuarios']);
      },
      error: () => {
        this.btnSaveDisabled = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo ${
            this.isEditMode ? 'actualizar' : 'crear'
          } el usuario`,
        });
        this.cd.markForCheck();
      },
    });
  }

  cancelar() {
    this.router.navigate(['/usuarios']);
  }
}
