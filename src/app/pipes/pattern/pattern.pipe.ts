import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pattern',
})
export class PatternPipe implements PipeTransform {
  transform(value: string, regex: string): boolean {
    if (!value) return false;
    let pattern = new RegExp(regex);

    return pattern.test(value);
  }
}
