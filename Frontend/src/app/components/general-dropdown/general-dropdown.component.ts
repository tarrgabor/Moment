import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Option } from '../../interfaces/interfaces';

@Component({
  selector: 'app-general-dropdown',
  imports: [CommonModule],
  templateUrl: './general-dropdown.component.html',
  styleUrl: './general-dropdown.component.scss'
})

export class GeneralDropdownComponent {
  @ViewChild("optionsContainer") optionsContainer!: ElementRef;

  options: Option[] = [];

  selectedOption: Option = {
    id: '',
    text: ''
  };

  getOptions(optionsArray: Option[])
  {
    this.options = optionsArray;

    this.selectedOption = optionsArray?.[0];
  }

  selectOption(event: any)
  {
    const option = this.options.find(option => option.id == event.target.id);

    option ? this.selectedOption = option : this.selectedOption;
  }

  toggleDropdown()
  {
    this.optionsContainer.nativeElement.classList.toggle("open");
  };

  getValue()
  {
    return this.selectedOption.id;
  }
}
