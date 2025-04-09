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
@Component({
  selector: 'app-update-post',
  imports: [NavbarComponent, CommonModule, GeneralTextareaComponent, GeneralDropdownComponent, GeneralButtonComponent],

  templateUrl: './update-post.component.html',
  styleUrl: './update-post.component.scss'
})
export class UpdatePostComponent {

}
