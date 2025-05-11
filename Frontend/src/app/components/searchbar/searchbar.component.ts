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
  searchbarText: string = "";
  queryString: string = "";
  queryParams = new URLSearchParams();
  selectedCategories: string = "";
  isFocused: boolean = false;

  constructor(
    private api: ApiService,
    private categoryService: CategoryService
  )
  {
    this.searchDebouncer = this.debounce(750, (filterText: any) => {
      this.searchbarText = filterText;

      this.setSearchParams();

      if (this.searchbarText.length)
      {
        this.api.search(`q=${filterText}`).subscribe((res: any) => {
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

      this.setSearchParams();
    });

    this.searchbar.nativeElement.value = new URLSearchParams(window.location.search).get("q");

    this.searchbar.nativeElement.addEventListener("keydown", (event: any) => {
      if (event.key == "Enter")
      {
        this.search();
      }
    })
  }

  setSearchParams()
  {
    this.queryParams = new URLSearchParams();

    this.searchbarText ? this.queryParams.append("q", this.searchbarText) : null;
    this.selectedCategories ? this.queryParams.append("categories", this.selectedCategories) : null;

    this.queryString = "?" + this.queryParams.toString();
  }

  search()
  {
    this.searchbarText = this.searchbar.nativeElement.value;

    this.setSearchParams();

    window.location.href = `${this.queryString}`;
  }

  updateSearchbar()
  {
    if (!this.searchbar.nativeElement.value)
    {
      this.data = null;
      this.searchbarText = "";
    }

    this.isFocused = true;

    this.setSearchParams();

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

    !this.data ? this.updateSearchbar() : null;
  }

  hideResults()
  {
    this.isFocused = false;
  }
}
