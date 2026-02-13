import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'stockflow-frontend';
  private themeService = inject(ThemeService);
}
