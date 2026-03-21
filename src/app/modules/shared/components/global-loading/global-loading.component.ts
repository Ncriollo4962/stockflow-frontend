import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { GlobalLoadingService } from '../../../../core/services/global-loading.service';

@Component({
  selector: 'app-global-loading',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './global-loading.component.html',
})
export class GlobalLoadingComponent {
  private readonly loadingService = inject(GlobalLoadingService);

  loading = this.loadingService.isLoading;
}
