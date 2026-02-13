import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'sidebar',
  imports: [CommonModule, DrawerModule, ButtonModule, MenuComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() menuMode: 'static' | 'overlay' = 'static';
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  closeCallback(e: Event): void {
    this.visibleChange.emit(false);
  }
}
