import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { RequestLogin } from '../../interfaces/requestLogin';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    RippleModule,
    ToastModule,
  ],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  isLoading = signal(false);

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false],
  });

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);

      const loginData = this.loginForm.value as RequestLogin;

      this.authService.login(loginData).subscribe((isAuthenticated) => {
        console.log('Login exitoso', isAuthenticated);
        if (isAuthenticated) {
          this.router.navigate(['/dashboard']);
          this.isLoading.set(false);
          return;
        }
        this.isLoading.set(false);
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
