import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'menu',
  imports: [
    CommonModule,
    RippleModule,
    ButtonModule,
    AvatarModule,
    StyleClassModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  @Input() isOverlay: boolean = false;
  @Output() close = new EventEmitter<void>();

  closeMenu() {
    this.close.emit();
  }
}
