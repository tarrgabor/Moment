import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../interfaces/interfaces';
import { CategoryFilterPipe } from '../../pipes/caregoryFilter.pipe';

@Component({
  selector: 'app-sidebar-filter',
  imports: [CommonModule, FormsModule, CategoryFilterPipe],
  templateUrl: './sidebar-filter.component.html',
  styleUrl: './sidebar-filter.component.scss'
})

export class SidebarFilterComponent implements OnInit{

  categoryFilterText: string = "";

  categories: Category[] = [
    {
      id: "1",
      name: "Táj"
    },
    {
      id: "2",
      name: "Állatok"
    },
    {
      id: "3",
      name: "Kozmosz"
    },
    {
      id: "4",
      name: "Növények"
    }
  ];

  selectedCategories: Category[] = [];

  ngOnInit(): void {
    document.querySelector(".sidebarContainer")!.addEventListener('mouseover', function() {
      document.body.style.overflow = 'hidden';
    });

    document.querySelector(".sidebarContainer")!.addEventListener('mouseleave', function() {
      document.body.style.overflow = 'auto';
    });
  }

  openFilterSidebar()
  {
    document.querySelector(".sidebarContainer")!.classList.add("open");
  }

  closeFilterSidebar()
  {
    document.querySelector(".sidebarContainer")!.classList.remove("open");
  }


  toggleCategory(category: Category){
    if (this.selectedCategories.includes(category))
    {
      this.categories.push(category);
      this.selectedCategories.splice(this.selectedCategories.indexOf(category), 1)
      return;
    }

    this.selectedCategories.push(category);
    this.categories.splice(this.categories.indexOf(category), 1)
  }
}
