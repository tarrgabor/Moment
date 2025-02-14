import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../interfaces/interfaces';

@Pipe({
  name: 'filterCategory'
})
export class CategoryFilterPipe implements PipeTransform {
  transform(categories: Category[], filterText: string) {
    if (categories.length == 0 || filterText == "") return categories;

    return categories.filter((category) => {
      return category.name.toLowerCase().includes(filterText.toLowerCase());
    });
  }

}
