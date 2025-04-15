import { Component, Input } from '@angular/core';
import { User } from '../../interfaces/interfaces';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})

export class UserComponent {
  @Input("getUserData") user: User = {
    username: "",
    profilePicture: "",
    followerCount: 0
  }
}
