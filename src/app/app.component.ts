import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'stockflow-frontend';
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.authService
      .login({
        email: 'test@test.com',
        password: '1234',
      })
      .subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
        },
        error: (error) => {
          console.error('Error en login:', error);
        },
      });
  }
}
