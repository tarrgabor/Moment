import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-category-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-upload.component.html',
  styleUrls: ['./category-upload.component.scss']
})
export class CategoryUploadComponent implements OnInit {
  newCategoryName: string = '';
  categories: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>('http://localhost:3000/categories', { headers }).subscribe({
      next: (res) => this.categories = res,
      error: (err) => console.error('Kategóriák lekérdezése sikertelen:', err)
    });
  }

  createCategory() {
    const body = { name: this.newCategoryName };
    const token = localStorage.getItem('token');
  
    this.http.post('http://localhost:3000/categories/create', body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (res: any) => {
        alert(res.message || 'Sikeres kategória létrehozás!');
        this.newCategoryName = '';
        this.getCategories(); // újratöltés a kategóriák lekéréséhez
      },
      error: (err) => {
        console.error('Kategória létrehozása sikertelen:', err);
        alert(err.error.message || 'Hiba a létrehozás során!');
      }
    });
  }
}
