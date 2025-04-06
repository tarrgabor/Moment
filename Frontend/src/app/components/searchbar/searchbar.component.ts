import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { BoundaryCheckDirective } from '../../directives/boundary-check.directive';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../interfaces/interfaces';

@Component({
  selector: 'app-searchbar',
  imports: [CommonModule, BoundaryCheckDirective],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss'
})

export class SearchbarComponent implements AfterViewInit{
  @ViewChild("searchbar") searchbar!: ElementRef;

  searchDebouncer: any;
  data: any;
  searchText: string = "";
  selectedCategories: string = "";
  isFocused: boolean = false;

  constructor(
    private api: ApiService,
    private categoryService: CategoryService
  )
  {
    this.searchDebouncer = this.debounce(750, (filterText: any) => {
      this.searchText = filterText;

      this.isFocused = true;

      if (this.searchText.length)
      {
        this.api.search(`search=${filterText}`).subscribe((res: any) => {
          this.data = res;
        });
      }
    });
  }

  ngAfterViewInit()
  {
    this.categoryService.categorySubject.subscribe((categories: Category[]) => {
      this.selectedCategories = "";

      categories.forEach(category => {
        if (category.isSelected)
        {
          this.selectedCategories += `|${category.name}`;
        }
      })

      this.selectedCategories = this.selectedCategories.replace('|', '');
    });

    this.searchbar.nativeElement.value = new URLSearchParams(window.location.search).get("search");
  }

  updateSearchbar()
  {
    if (!this.searchbar.nativeElement.value)
    {
      this.data = null;
      this.searchText = "";
    }

    this.searchDebouncer(this.searchbar.nativeElement.value);
  };

  debounce(debounceTime: number, callback: Function)
  {
    let debounce: any;

    return (...args: any) => {
      clearTimeout(debounce);

      debounce = setTimeout(() => {
        callback(...args);
      }, debounceTime);
    };
  }

  showResults()
  {
    this.isFocused = true;

    this.searchbar.nativeElement != document.activeElement ? this.searchbar.nativeElement.focus() : null;

    !this.data ? this.updateSearchbar() : null;
  }

  hideResults()
  {
    this.isFocused = false;
  }
}
