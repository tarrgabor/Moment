import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';
import { GeneralTextareaComponent } from '../general-textarea/general-textarea.component';
import { GeneralDropdownComponent } from '../general-dropdown/general-dropdown.component';
import { GeneralButtonComponent } from '../general-button/general-button.component';
import { ApiService } from '../../services/api.service';
import { Option } from '../../interfaces/interfaces';
import { Router } from '@angular/router';
import { SidebarFilterComponent } from '../sidebar-filter/sidebar-filter.component';

@Component({
  selector: 'app-upload-post',
  imports: [NavbarComponent, CommonModule, GeneralTextareaComponent, GeneralDropdownComponent, GeneralButtonComponent, SidebarFilterComponent],
  templateUrl: './upload-post.component.html',
  styleUrl: './upload-post.component.scss'
})

export class UploadPostComponent implements OnInit {
  @ViewChild("dropArea") dropArea!: ElementRef
  @ViewChild("imageInput") imageInput!: ElementRef
  @ViewChild("imagePreview") imagePreview!: ElementRef

  @ViewChild("postTitle") postTitle!: GeneralTextareaComponent;
  @ViewChild("postDescription") postDescription!: GeneralTextareaComponent;

  @ViewChild("categoryOptions") categoryOptions!: GeneralDropdownComponent

  constructor(
    private message: MessageService,
    private api: ApiService,
    private router: Router
  ){}

  ngOnInit()
  {
    this.api.getCategories("categories").subscribe((res: any) => {
      let options: Option[] = [];
      res.forEach((element: any) => {
        options.push({id: element.id, text: element.name});
      });

      this.categoryOptions.getOptions(options);
    });
  }
  
  hasImage: Boolean = false;

  onDragOver(event: Event)
  {
    event.preventDefault();
  }

  onDrop(event: any)
  {
    event.preventDefault();

    this.imageInput.nativeElement.files = event.dataTransfer.files;

    this.setImage({target: {files: [event.dataTransfer.files[0]]}});
  }

  setImage(event: any)
  {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]

    if (!allowedTypes.includes(event.target.files[0].type))
    {
      return this.message.error("Nem megfelelő fájl formátum!");
    }

    if (event.target.files[0].size > 8 * 1024 * 1024)
    {
      return this.message.error("A fájl mérete maximum 8 MB lehet!");
    }

    this.imagePreview.nativeElement.style.display = "block";

    this.imagePreview.nativeElement.src = URL.createObjectURL(event.target.files[0]);

    this.hasImage = true;
  }

  createPost()
  {
    if (this.postTitle.charsUsed > this.postTitle.maxLength)
    {
      this.message.error("A cím meghaladja a maximális karakterek számát!");
      return;
    }

    if (this.postDescription.charsUsed > this.postDescription.maxLength)
    {
      this.message.error("A leírás meghaladja a maximális karakterek számát!");
      return;
    }

    const formData = new FormData();
    formData.append("title", this.postTitle.getValue());
    formData.append("description", this.postDescription.getValue());
    formData.append("categoryID", this.categoryOptions.getValue());
    formData.append("file", this.imageInput.nativeElement.files[0]);

    this.api.createPost("posts", formData).subscribe((res: any) => {
      if (res.success)
      {
        this.router.navigate([`/post/${res.id}`]);
        return;
      }

      this.message.error(res.message);
    });
  }
}
