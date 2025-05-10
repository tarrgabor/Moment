import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { LightboxListenerComponent } from '../lightbox-listener/lightbox-listener.component';
import { LightboxComponent } from '../lightbox/lightbox.component';
import { LikeButtonComponent } from '../like-button/like-button.component';
import { Option, Post } from '../../interfaces/interfaces';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { CommentContainerComponent } from '../comment-container/comment-container.component';
import { UserContentHeaderComponent } from '../user-content-header/user-content-header.component';
import { SidebarFilterComponent } from '../sidebar-filter/sidebar-filter.component';
import { ContentMenuComponent } from '../content-menu/content-menu.component';
import { DialogService } from '../../services/dialog.service';
import { DialogComponent } from '../dialog/dialog.component';
import { MessageService } from '../../services/message.service';
import { Router } from '@angular/router';
import { GeneralTextareaComponent } from '../general-textarea/general-textarea.component';
import { GeneralDropdownComponent } from '../general-dropdown/general-dropdown.component';
import { CopyComponent } from '../copy/copy.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-open-post',
  imports: [NavbarComponent, CommonModule, LightboxListenerComponent, LightboxComponent, LikeButtonComponent, PageNotFoundComponent, CommentContainerComponent, UserContentHeaderComponent, SidebarFilterComponent, ContentMenuComponent, DialogComponent, GeneralTextareaComponent, GeneralDropdownComponent, CopyComponent],
  templateUrl: './open-post.component.html',
  styleUrl: './open-post.component.scss'
})

export class OpenPostComponent implements OnInit{
  @ViewChild("postTitle") postTitle!: GeneralTextareaComponent;
  @ViewChild("postDescription") postDescription!: GeneralTextareaComponent;
  @ViewChild("categoryOptions") categoryOptions!: GeneralDropdownComponent

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private dialog: DialogService,
    private message: MessageService,
    private router: Router
  ){}

  postData: Post = {
    username: '',
    profilePicture: '',
    postID: '',
    title: '',
    description: '',
    category: '',
    image: '',
    likes: 0,
    createdAt: new Date(),
    liked: false,
    owned: false
  };
  
  fetchedData = false;

  postFound = true;

  isEditing = false;

  ngOnInit()
  {
    const postID = window.location.pathname.match("(?<=\/post\/)([^\/]+)")?.[1];

    this.api.getPost("posts", postID!).subscribe(res => {
      if (res)
      {
        this.postData = res as Post;

        this.fetchedData = true;
  
        if (decodeURIComponent(window.location.pathname.match("\([^\/]+)$")![0]) != this.postData.title.replaceAll(' ', '_').match("^\([^\/]+)$")?.[1])
        {
          window.location.pathname = `post/${postID}/${this.postData.title.replaceAll(' ', '_')}`;
        }

        return
      };

      this.postFound = false;
    });
  }

  cancelUpdate()
  {
    this.isEditing = false;
  }

  modifyPost()
  {
    this.isEditing = true;

    this.api.getCategories("categories").subscribe((res: any) => {
      let options: Option[] = [];
      res.forEach((element: any) => {
        options.push({id: element.id, text: element.name});
      });
    
      this.categoryOptions.getOptions(options);
    });
  }

  updatePost()
  {
    this.api.updatePost("posts", this.postData.postID, {
        title: this.postTitle.getValue(),
        description: this.postDescription.getValue(),
        categoryID: this.categoryOptions.getValue()
      }).subscribe((res: any) => {
      if (res.success)
      {
        document.location.reload();
        return;
      }

      this.message.error("Poszt módosítás sikertelen!");
    })
  }

  deletePost()
  {
    this.dialog.showDialog("Biztosan törölni szeretné?", "Törlés", () => {
      this.api.deletePost("posts", this.postData.postID).subscribe((res: any) => {
        if (res.success)
        {
          this.message.success("Poszt törölve!");
          this.router.navigate(["/"]);
          return;
        }

        this.message.error("Poszt törlése sikertelen!");
      });
    })
  }

  copyURL()
  {
    navigator.clipboard.writeText(`http://localhost:4200/post/${this.postData.postID}/${this.postData.title.replaceAll(' ', '_')}`);
  }
}
