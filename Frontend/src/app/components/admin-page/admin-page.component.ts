import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ReportsComponent } from '../reports/reports.component';
import { CategoryUploadComponent } from '../category-upload/category-upload.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    NavbarComponent,
    ReportsComponent,
    CategoryUploadComponent
  ],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
  activeTabId: string = 'general';
  users: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.http.get<any>('http://localhost:3000/api/users/all', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.users = res.users;
        }
      },
      error: (err) => {
        console.error('Nem sikerült betölteni a felhasználókat:', err);
      }
    });
  }
}
