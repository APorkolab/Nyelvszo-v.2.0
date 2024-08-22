import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sorter',
})
export class SorterPipe<T extends { [key: string]: any }> implements PipeTransform {
  transform(value: T[] | null, key: string, dir: number = 1): T[] | null {
    if (!Array.isArray(value) || !key) {
      return value;
    }

    return value.sort((a, b) => {
      let first = this.extractValue(a[key]);
      let second = this.extractValue(b[key]);

      if (typeof first === 'number' && typeof second === 'number') {
        return (first - second) * dir;
      } else {
        return first.toString().toLowerCase().localeCompare(second.toString().toLowerCase()) * dir;
      }
    });
  }

  private extractValue(value: any): any {
    if (value === null || value === undefined) {
      return ''; // Null vagy undefined esetén üres stringet adunk vissza
    }
    if (typeof value === 'object') {
      return Object.values(value).join('');
    }
    return value;
  }
}