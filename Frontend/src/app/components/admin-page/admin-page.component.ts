import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { DialogService } from '../../services/dialog.service';
import { DialogComponent } from '../dialog/dialog.component';
import { SidebarFilterComponent } from '../sidebar-filter/sidebar-filter.component';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, DialogComponent, SidebarFilterComponent],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
  activeTabId: string = 'categories';
  categories: any[] = [];

  newCategoryName: string = "";

  constructor(
    private api: ApiService,
    private message: MessageService,
    private dialog: DialogService
  ) {}

  ngOnInit()
  {
    this.getCategories();
  }

  getCategories()
  {
    this.api.getCategories("categories").subscribe((res: any) => {
      this.categories = res;
    })
  }

  createCategory()
  {
    this.api.createCategory("categories", this.newCategoryName).subscribe((res: any) => {
      if (res.success)
      {
        this.message.success(res.message);
        this.categories.push({id: res.categoyID, name: this.newCategoryName});
        this.newCategoryName = "";
        return;
      }

      this.message.error(res.message);
    });
  }

  deleteCategoryByID(id: string)
  {
    this.dialog.showDialog("Biztosan törölni szeretné?", "Törlés", () => {
      this.api.deleteCategory("categories", id).subscribe((res: any) => {
        if (res.success)
        {
          this.message.success(res.message);
          this.categories = this.categories.filter(category => category.id !== id);
          return;
        }

        this.message.error(res.message);
      });
    });
  }
}
