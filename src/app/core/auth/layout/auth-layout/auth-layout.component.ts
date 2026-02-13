import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '../../../../core/services/theme.service';
import { ImportsModule } from '../../../../imports';

@Component({
  selector: 'auth-layout',
  imports: [RouterOutlet, ButtonModule, ImportsModule],
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent {
  private readonly themeService = inject(ThemeService);
  isDarkMode = this.themeService.isDarkMode;

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
