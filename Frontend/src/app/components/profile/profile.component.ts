import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarFilterComponent } from '../sidebar-filter/sidebar-filter.component';
import { LightboxComponent } from '../lightbox/lightbox.component';
import { ApiService } from '../../services/api.service';
import { Post } from '../../interfaces/interfaces';
import { PostComponent } from '../post/post.component';
import { IntersectionObserverComponent } from '../intersection-observer/intersection-observer.component';
import { LoadingComponent } from '../loading/loading.component';
import { FollowButtonComponent } from '../follow-button/follow-button.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { BanButtonComponent } from '../ban-button/ban-button.component';
import { DialogService } from '../../services/dialog.service';
import { DialogComponent } from '../dialog/dialog.component';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, NavbarComponent, SidebarFilterComponent, LightboxComponent, PostComponent, IntersectionObserverComponent, LoadingComponent, FollowButtonComponent, PageNotFoundComponent, BanButtonComponent, DialogComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent implements OnInit{
  constructor(
    private api: ApiService,
    public auth: AuthService,
    private dialog: DialogService,
    private message: MessageService
  ){}

  profile: any = {
    username: "",
    profilePicture: "",
    followerCount: 0,
    followedCount: 0,
    banned: 0
  }

  posts: Post[] = [];

  isFetching: boolean = false;
  hasMoreData: boolean = true;
  userFound = true;

  cursor: string = "";

  self: boolean = false;

  @ViewChild("profilePicture") profilePicture!: ElementRef;
  @ViewChild("imageInput") imageInput!: ElementRef;
  @ViewChild("imagePreview") imagePreview!: ElementRef;

  imageHovered: boolean = false;
  hasImage: boolean = false;

  ngOnInit()
  {
    this.profile.username = window.location.pathname.split('/')[2];
    this.getUserData();

    if (this.auth.getLoggedInUser().username == this.profile.username)
    {
      this.self = true;
    }
  }

  getUserData()
  {
    this.api.getProfile(this.profile.username).subscribe((res: any) => {
      this.profile = res.user;

      if (!res.success)
      {
        this.userFound = false;
      }
    });
  }

  fetchData()
  {
    const searchParams = new URLSearchParams();

    this.cursor ? searchParams.set("cursor", this.cursor) : null;

    if (this.hasMoreData)
    {
      this.isFetching = true;

      this.api.getUsersPosts("posts", this.profile.username, searchParams.toString()).subscribe((res: any) => {
        this.posts.push(...res.posts as Post[]);

        this.cursor = String(res.nextCursor).replace(' ', '+');

        if (res.posts.length == 0)
        {
          this.hasMoreData = false;
        }
      })

      this.isFetching = false;
    }
  }

  toggleFollow()
  {
    this.api.toggleFollow("users", this.profile.username).subscribe((res: any) => {
      if (res.success)
      {
        this.profile.followed = res.followed;

        if (res.followed)
        {
          this.profile.followerCount++;
          return;
        }

        this.profile.followerCount--;
      }
    });
  }

  toggleBan()
  {
    this.dialog.showDialog(
      this.profile.banned ? "Biztosan feloldja a felhasználó tiltását?" : "Biztosan ki akarja tiltani ezt a felhasználót?",
      this.profile.banned ? "Feloldás" : "Tiltás",
    () => {
      this.api.toggleBan(this.profile.username).subscribe((res: any) => {
        if (res.success)
        {
          console.log(res);
          this.message.success(res.message);
          this.profile.banned = res.banned;
          return;
        }

        this.message.error(res.message);
      });
    });
  }

  showOverlay()
  {
    this.imageHovered = true;
  }

  hideOverlay()
  {
    this.imageHovered = false;
  }

  onDragOver(event: Event)
  {
    event.preventDefault();
  }

  onDrop(event: any)
  {
    event.preventDefault();

    this.setImage({target: {files: event.dataTransfer.files}});
  }

  setImage(event: any)
  {
    if (!event.target.files) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]

    if (!allowedTypes.includes(event.target.files[0]?.type))
    {
      return this.message.error("Nem megfelelő fájl formátum!");
    }

    if (event.target.files[0]?.size > 8 * 1024 * 1024)
    {
      return this.message.error("A fájl mérete maximum 8 MB lehet!");
    }

    this.imageInput.nativeElement.files = event.target.files;

    this.imagePreview.nativeElement.src = URL.createObjectURL(event.target.files[0]);

    this.hasImage = true;
  }

  uploadProfilePicture()
  {
    const formData = new FormData();
    formData.append("file", this.imageInput.nativeElement.files[0]);

    this.api.uploadProfilePicture(this.profile.username, formData).subscribe((res: any) => {
      if (res.success)
      {
        this.api.requestRefreshedToken().subscribe((result: any) => {
          if (result.success)
          {
            this.auth.saveNewToken(result.token);
            window.location.reload();
          }
        });

        return;
      }

      this.message.error(res.message);
    });
  }

  cancelUpload()
  {
    this.imageInput.nativeElement.value = null;
    this.imagePreview.nativeElement.src = this.auth.getLoggedInUser().profilePicture;
    this.hasImage = false;
  }
}