import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'topbar',
  imports: [CommonModule, ButtonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  @Input() showMenuToggle = true;
  @Input() alwaysShowMenuToggle = false;
  @Input() menuMode: 'static' | 'overlay' = 'static';
  @Input() isDarkMode = signal(true);

  @Output() menuToggle = new EventEmitter<void>();
  @Output() themeToggle = new EventEmitter<void>();
  @Output() settingsClick = new EventEmitter<Event>();

  onMenuToggle() {
    this.menuToggle.emit();
  }

  onThemeToggle() {
    this.themeToggle.emit();
  }

  onSettingsClick(event: Event) {
    this.settingsClick.emit(event);
  }
}
