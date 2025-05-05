import { Component, EventEmitter, Output } from '@angular/core';
import { BoundaryCheckDirective } from '../../directives/boundary-check.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-menu',
  imports: [BoundaryCheckDirective, CommonModule],
  templateUrl: './content-menu.component.html',
  styleUrl: './content-menu.component.scss'
})

export class ContentMenuComponent {
  @Output() onModify = new EventEmitter();
  @Output() onDelete = new EventEmitter();

  open: boolean = false;

  openMenu()
  {
    this.open = true;
  }

  closeMenu()
  {
    this.open = false;
  }

  modify()
  {
    this.onModify.emit();
    this.closeMenu();
  }

  delete()
  {
    this.onDelete.emit();
    this.closeMenu();
  }
}
