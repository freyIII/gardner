import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { User } from 'src/app/models/user.interface';
import { config, Subject } from 'rxjs';
import { values } from 'lodash';
import { SPECIAL_TYPE_CONDITONS } from 'src/app/models/table.interface';

export interface HSLA {
  saturation?: number;
  lightness?: number;
  alpha?: number;
  amount: number;
}

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  genericErrorMsg: string =
    "We're sorry, an error has occured. Please try again later.";

  empties = [null, undefined];
  loadingRef: any;
  public sideNavState$: Subject<boolean> = new Subject();
  constructor(public clipboard: Clipboard) {}

  private _httpErrorTranslate(response: HttpErrorResponse) {
    let msg = '';
    let statusCode = response.status;
    if (response.error && response.error.message) {
      msg = response.error.message;
    }

    if (!msg) {
      if (response.status === 0) {
        msg = 'Server is unreachable, please check your internet.';
      }

      if (response.status === 404) {
        msg =
          "The URL you were trying to reach couldn't be found on the server.";
      }

      if (response.status === 401) {
        msg = 'Unauthorized request, please login to continue.';
      }

      if (response.status === 400) {
        msg = 'Bad request, please contact the administrator.';
      }

      if (!msg) {
        msg = 'Something went wrong, please contact the administrator.';
      }
    }

    return {
      msg,
      statusCode,
    };
  }

  traverseArray(arr: any[], path: string, values: any[] = []): any {
    if (!arr.length) return values.join(', ');

    const arrCopy = [...arr];
    const obj = arrCopy.splice(0, 1)[0];

    const foundVal = this.deepFind(obj, path);
    if (foundVal) values.push(foundVal);
    return this.traverseArray(arr.slice(1), path, values);
  }

  deepFind(obj: any, path: string | Array<string | number>): any {
    if (!obj && obj != 0) return '';
    if (obj && !path) return '';

    if (typeof path == 'string') return this.deepFind(obj, path.split('.'));
    else if (path.length == 0)
      return this.empties.includes(obj)
        ? ''
        : Array.isArray(obj)
        ? obj.join(', ')
        : obj;
    else if (Array.isArray(obj)) return this.traverseArray(obj, path.join('.'));
    else return this.deepFind(obj[path[0]], path.slice(1));
  }

  deepFind2(obj: any, path: string | Array<string | number>): any {
    // console.log(obj);
    // console.log(path);
    if (!obj && obj != 0) return '';
    if (obj && !path) return '';

    if (typeof path == 'string') return this.deepFind2(obj, path.split('.'));
    else if (path.length == 0) return this.empties.includes(obj) ? '' : obj;
    else if (Array.isArray(obj)) return this.traverseArray(obj, path.join('.'));
    else return this.deepFind2(obj[path[0]], path.slice(1));
  }

  evaluateCondition(element: any, conditions: SPECIAL_TYPE_CONDITONS) {
    for (let condition of conditions.conds) {
      const path = condition.pathToCompare;
      const values = condition.valueToCompare;
      const foundValue = this.deepFind(element, path);

      if (condition.operator === '==') return values.includes(foundValue);
      if (condition.operator == '!=') return !values.includes(foundValue);
    }

    return false;
  }

  pathHaveValue(element: any, paths: SPECIAL_TYPE_CONDITONS) {
    let isValid = true;

    for (let condition of paths.conds) {
      const path = condition.pathToCompare;
      const foundValue = this.deepFind(element, path);
      if (!foundValue) return false;
    }

    return isValid;
  }

  getPath(obj: any, path: string): any {
    let tempObj = this.deepCopy(obj);
    let pathArray = path.split('.');
    let counter = 0;
    for (let path of pathArray) {
      if (tempObj[path]) tempObj = tempObj[path];
      else break;
      counter++;
    }

    if (counter !== pathArray.length) return null;
    if (
      !['string', 'number', 'boolean'].includes(typeof tempObj) &&
      !Array.isArray(tempObj)
    )
      return null;

    return tempObj;
  }

  deepCopy(toBeCopied: any) {
    return JSON.parse(JSON.stringify(toBeCopied));
  }

  formNumberInputOnly(event: any) {
    return (
      // backspace
      (event.charCode > 7 && event.charCode < 9) ||
      // period ('.')
      (event.charCode > 45 && event.charCode < 47) ||
      // 0-9
      (event.charCode > 47 && event.charCode < 58) ||
      // delete
      (event.charCode > 126 && event.charCode < 128)
    );
  }

  stringSlugify(str: string): string {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
    var to = 'aaaaeeeeiiiioooouuuunc------';
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str
      .replace(/^[.& ,+!@#$%\^*();\/|<>"'?=:\t_\n[]{}~` -]/g, '')
      .replace(/[.& ,+!@#$%\^*();\/|<>"'?=:\t_\n[]{}~` -]$/g, '')
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  }

  evaluateString(obj: any, logic: string) {
    let tempLogic = logic;
    const regexp = /\/(.*?)\//g;
    const paths = logic.match(regexp);

    if (!paths) return false;
    for (const path of paths) {
      const objPath = path.split('/')[1];
      tempLogic = tempLogic.replace(
        path,
        this.deepFind(obj, objPath) || obj[objPath]
      );
    }

    try {
      return eval(tempLogic);
    } catch {
      return false;
    }
  }

  evaluateStringV2(obj: any, logic: string, obj1?: any) {
    if (!obj) return false;
    if (!logic) return true;
    let tempLogic = logic;
    let isDoubleSlash = true;
    let paths = logic.match(/\/\/(.*?)\/\//g);
    if (!paths) {
      isDoubleSlash = false;
      paths = logic.match(/\/(.*?)\//g);
    }

    if (!paths) return false;
    for (const path of paths) {
      let objPath = path.split('/')[1];
      if (isDoubleSlash) {
        objPath = path.split('//')[1];
      }
      let value = '';
      if (this.hasValue(obj[objPath])) {
        value = obj[objPath];
      } else if (this.hasValue(this.deepFind(obj, objPath))) {
        value = this.deepFind(obj, objPath);
      }

      if (!value && obj1) {
        if (this.hasValue(obj1[objPath])) {
          value = obj1[objPath];
        } else if (this.hasValue(this.deepFind(obj1, objPath))) {
          value = this.deepFind(obj1, objPath);
        }
      }

      if (Array.isArray(value)) {
        value = JSON.stringify(value);
      }
      // console.log(value, 'VALLLLLLLLL');

      tempLogic = tempLogic.replace(path, value);
    }

    try {
      const evalLogic = eval(tempLogic);
      // console.log(evalLogic);
      return evalLogic ? true : false;
    } catch {
      return false;
    }
  }

  isEmail(email: string) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  copyToClipboard(toCopy?: any) {
    this.clipboard.copy(toCopy);
    return 'copied';
  }

  dataChanges(
    mainObj: { [index: string]: any },
    toCompare: { [index: string]: any }
  ) {
    if (!mainObj) return false;
    for (let [key, value] of Object.entries(mainObj)) {
      if (Array.isArray(value) && Array.isArray(toCompare[key])) {
        const arrLength = value.length + toCompare[key].length;

        if (arrLength !== toCompare[key].length) return false;
      }

      if (typeof value === 'object') {
        if (this.dataChanges(value[key], toCompare[key])) return false;
      } else {
        if (typeof toCompare[key] === 'number') {
          toCompare[key] = toCompare[key].toString();
        }

        if (typeof value === 'number') {
          value = value.toString();
        }

        if (
          value !==
          (typeof toCompare[key] === 'object'
            ? toCompare[key]._id
            : toCompare[key])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  dataChangesArray(mainArray: Array<any>, toCompareArray: Array<any>) {
    let changes = false;
    mainArray.forEach((main: any, index: number) => {
      for (let [key, value] of Object.entries(main)) {
        if (typeof value === 'string' || typeof value === 'number')
          if (toCompareArray[index][key] !== value) {
            changes = true;
          }
      }
    });
    return changes;
  }

  emptyDetails(obj: any) {
    for (let value of Object.values(obj)) {
      if (value) {
        return false;
      }
    }
    return true;
  }

  hasValue(value: any) {
    if (value === '' || this.empties.includes(value)) return false;

    return true;
  }

  /**
   * @param saturation = default 0.8
   * @param lightness = default 0.75
   * @param alpha = default 1
   * @param amount = type: number *required
   * @returns
   */
  generateHslaColors(hsla: HSLA) {
    const saturation = hsla.saturation || 80;
    const lightness = hsla.lightness || 75;
    const alpha = hsla.alpha || 1;
    const { amount } = hsla;

    let colors = [];
    let huedelta = Math.trunc(360 / amount);

    for (let i = 0; i < amount; i++) {
      let hue = i * huedelta + 11; // Remove Red Hue
      const convertedRgb = this.hslToHex(hue, saturation, lightness);
      colors.push(`${convertedRgb}`);
    }
    return colors;
  }

  hslToHex(h: any, s: any, l: any) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: any) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0'); // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  hexToRgbObject(hex: string) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  getRandomArbitrary(min: number = 0, max: number = 1) {
    return Math.random() * (max - min) + min;
  }

  insertParseValuePipeline(pipeline: any, toInsert: Array<any>) {
    console.log(pipeline);
    for (let item of toInsert) {
      for (let el of pipeline) {
        if (el?.$match?.id2parse) {
          for (let toParse of el.$match.id2parse) {
            if (toParse.field === item.field) toParse.eq = item.value;
          }
        }

        if (el?.$match?.date2parse) {
          for (let toParse of el.$match.date2parse) {
            if (toParse.field === item.field) {
              toParse.gte = item.gte;
              toParse.lte = item.lte;
            }
          }
        }
      }
    }

    return pipeline;
  }
}
