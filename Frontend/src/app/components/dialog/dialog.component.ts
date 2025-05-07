import { Component } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})

export class DialogComponent {
  constructor(public dialog: DialogService){}

  preventDefault(event: Event)
  {
    event.stopPropagation();
  }
}
