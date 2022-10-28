import { Pipe, PipeTransform } from '@angular/core';
import { UtilService } from 'src/app/services/util/util.service';

@Pipe({
  name: 'objectFind',
})
export class ObjectFindPipe implements PipeTransform {
  constructor(private util: UtilService) {}

  transform(
    arrayOrObj: Array<Object> | Object,
    path: string,
    resultType: 'value' | 'key' | 'object' = 'object',
    compareTo?: any
  ) {
    if (!arrayOrObj || !path || resultType === 'key') return null;

    if (arrayOrObj instanceof Array && resultType === 'object' && compareTo) {
      return arrayOrObj.find((obj: Object) => {
        let objValue = this.util.getPath(obj, path);
        if (typeof objValue === 'string') objValue = objValue.toLowerCase();
        if (typeof compareTo === 'string') compareTo = compareTo.toLowerCase();
        return objValue === compareTo;
      });
    }

    return this.util.getPath(arrayOrObj, path);
  }
}
