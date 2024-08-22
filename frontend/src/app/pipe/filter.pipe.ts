import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe<T extends { [key: string]: any }> implements PipeTransform {
  transform(
    value: T[] | null,
    phrase: string = '',
    key: string = ''
  ): T[] | null {
    if (!Array.isArray(value) || typeof phrase !== 'string' || !phrase.trim()) {
      return value;
    }

    phrase = phrase.toLowerCase().trim();

    return value.filter((item) => {
      if (key && item[key] !== undefined) {
        return String(item[key]).toLowerCase().includes(phrase);
      } else {
        return this.valuesToString(item).includes(phrase);
      }
    });
  }

  private valuesToString(item: T): string {
    return Object.values(item).join(' ').toLowerCase();
  }
}