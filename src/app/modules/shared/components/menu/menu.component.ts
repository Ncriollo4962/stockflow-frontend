import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RippleModule,
    ButtonModule,
    AvatarModule,
    StyleClassModule,
  ],
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  @Input() isOverlay: boolean = false;
  @Output() shouldClose = new EventEmitter<void>();

  public authService = inject(AuthService);

  isAdmin = this.authService.isAdmin();

  closeMenu() {
    this.shouldClose.emit();
  }
}
