import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ReportsComponent } from '../reports/reports.component';
import { CategoryUploadComponent } from '../category-upload/category-upload.component';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ReportsComponent, CategoryUploadComponent],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent {
  activeTabId: string = 'general'; 
}
