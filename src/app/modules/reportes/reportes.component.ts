import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImportsModule } from '../../imports';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [ImportsModule, RouterModule],
  templateUrl: './reportes.component.html',
})
export class ReportesComponent {}
