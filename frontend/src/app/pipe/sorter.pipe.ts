import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sorter',
})
export class SorterPipe implements PipeTransform {
  transform(value: any[] | null, key: string, dir: number = 1): any[] | null {
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
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).join('');
    }
    return value;
  }
}