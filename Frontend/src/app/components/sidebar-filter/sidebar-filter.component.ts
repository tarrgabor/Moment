import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../interfaces/interfaces';
import { CategoryFilterPipe } from '../../pipes/caregoryFilter.pipe';
import { BoundaryCheckDirective } from '../../directives/boundary-check.directive';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-sidebar-filter',
  imports: [CommonModule, FormsModule, CategoryFilterPipe, BoundaryCheckDirective],
  templateUrl: './sidebar-filter.component.html',
  styleUrl: './sidebar-filter.component.scss'
})

export class SidebarFilterComponent implements OnInit{
  constructor(private categoryService: CategoryService){};

  @ViewChild("filter") filter!: ElementRef;

  categories: Category[] = [];

  isOpen: boolean = false;

  categoryFilterText: string = "";

  ngOnInit()
  {
    this.categoryService.fetchCategories();

    this.categoryService.categorySubject.subscribe((res: Category[]) => {
      this.categories = res;
    });
  }

  openSidebarFilter()
  {
    this.isOpen = true
  }

  closeSidebar()
  {
    this.isOpen = false;
  }

  toggleSidebarFilter(e: Event)
  {
    e.stopPropagation();

    this.isOpen = !this.isOpen;
  }

  toggleCategorySelection(categoryID: string)
  {
    this.categoryService.toggleCategorySelection(categoryID);
  }

  focusFilter()
  {
    this.filter.nativeElement.focus();
  }
}