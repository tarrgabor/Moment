import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Category } from '../interfaces/interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private api: ApiService){}

  categories: Category[] = [];

  categorySubject = new BehaviorSubject<Category[]>([]);
  category$ = this.categorySubject.asObservable();

  fetchCategories()
  {
    this.api.getCategories("categories").subscribe((res: any) => {
      this.categories = res as Category[];

      const selectedCategories = new URLSearchParams(window.location.search).get("categories")?.split('|');

      res.forEach((category: Category) => {
        if (selectedCategories?.includes(category.name))
        {
          category.isSelected = true;
        }
        else
        {
          category.isSelected = false;
        }
      });

      this.categorySubject.next(this.categories);
    });
  }

  toggleCategorySelection(categoryID: string)
  {
    const selectedCategory = this.categories.find(category => category.id == categoryID);
    selectedCategory!.isSelected = !selectedCategory?.isSelected;

    this.categorySubject.next(this.categories);
  }
}
