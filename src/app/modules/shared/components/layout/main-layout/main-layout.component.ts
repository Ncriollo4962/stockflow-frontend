import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '../../../../../core/services/theme.service';
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
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  @ViewChild('themePopover') themePopover!: ConfigPanelComponent;
  private themeService = inject(ThemeService);

  isDarkMode = this.themeService.isDarkMode;
  menuMode: 'static' | 'overlay' = 'static';
  visible: boolean = false;

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  onMenuToggle() {
    this.visible = !this.visible;
  }
}
