import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { ThemeService } from '../../../../../core/services/theme.service';
import { GlobalLoadingComponent } from '../../global-loading/global-loading.component';
import { ConfigPanelComponent } from '../../config-panel/config-panel.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { TopbarComponent } from '../../topbar/topbar.component';

@Component({
  selector: 'main-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    TopbarComponent,
    SidebarComponent,
    ConfigPanelComponent,
    GlobalLoadingComponent,
  ],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  @ViewChild('themePopover') themePopover!: ConfigPanelComponent;
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isDarkMode = this.themeService.isDarkMode;
  menuMode: 'static' | 'overlay' = 'static';
  visible: boolean = false;

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  onMenuToggle() {
    this.visible = !this.visible;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
