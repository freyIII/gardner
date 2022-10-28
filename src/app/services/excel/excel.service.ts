import { formatCurrency, formatDate, formatNumber } from '@angular/common';
import { Injectable } from '@angular/core';

import * as fileSaver from 'file-saver';
import { Column, ColumnCondition } from 'src/app/models/table.interface';
import * as XLSX from 'xlsx';
import { UtilService } from '../util/util.service';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  private extension = '.xlsx';
  private fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  constructor(private util: UtilService) {}

  startExporting(
    fileName: string,
    dataSource: Array<any>,
    columns: Array<Column>
  ) {
    const { json, sizes } = this._parseTableDataToJson(dataSource, columns);

    const blob = this._exportExcel({ json, sizes });

    fileSaver.saveAs(
      blob,
      `${fileName}_${formatDate(new Date(), 'MM-dd-y_h-mm-ssa', 'en_US')}${
        this.extension
      }`
    );
  }

  private _exportExcel({ json, sizes }: any) {
    let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    worksheet['!cols'] = sizes;
    let workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    let excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    return new Blob([excelBuffer], { type: this.fileType });
  }

  private _parseTableDataToJson(
    dataSource: Array<any>,
    columns: Array<Column>
  ) {
    let json = [];
    let columnSizes: any = [];
    for (let row of dataSource) {
      let temp: any = {};

      for (let column of columns) {
        if (!column.selected) continue;
        let columnValue = this.util.hasValue(row[column.path])
          ? row[column.path]
          : this.util.deepFind(row, column.path);
        if (this.util.hasValue(columnValue)) {
          switch (column.type) {
            case 'date':
              if (column.dateFormat) {
                columnValue = formatDate(
                  columnValue,
                  column.dateFormat,
                  'en-US',
                  '+0800'
                );
              } else {
                columnValue = formatDate(
                  columnValue,
                  'medium',
                  'en-US',
                  '+0800'
                );
              }
              break;
            case 'number':
              columnValue = formatNumber(columnValue, '1.2-4', 'en-US');
              break;
            case 'percentage':
              columnValue = formatNumber(columnValue, '1.1-2', 'en-US');
              break;
            case 'special':
              let columnValueArr = [];
              for (const path of column.paths) {
                if (this.util.deepFind(row, path)) {
                  columnValueArr.push(this.util.deepFind(row, path));
                }
              }
              columnValue = columnValueArr.join(' ');
              break;
            case 'currency':
              columnValue = formatCurrency(columnValue, 'en_US', 'PHP ');
              break;
            case 'logical':
              columnValue = this._displayLogical(row, column.conditions);
              break;
          }
        }
        temp[column.title] = columnValue;

        if (!columnSizes[column.path])
          columnSizes[column.path] = { wch: column.title.length };
        else if (columnSizes[column.path].wch < columnValue.length)
          columnSizes[column.path].wch = columnValue.length;
      }

      json.push(temp);
    }

    let sizes: any = [];
    Object.values(columnSizes).forEach((size: any) => {
      sizes.push({ wch: size.wch + 5 });
    });
    return { json: json, sizes: sizes };
  }

  private _displayLogical(row: any, conditions: Array<ColumnCondition>) {
    for (let condition of conditions) {
      if (this.util.evaluateString(row, condition.logic)) {
        return condition.value;
      }
    }
    return '';
  }

  public arrayOfArray(fileName: string, aoa: Array<string[]>) {
    const blob = this._exportAOA(aoa);

    fileSaver.saveAs(
      blob,
      `${fileName}_${formatDate(new Date(), 'MM-dd-y_h-mm-ssa', 'en_US')}${
        this.extension
      }`
    );
  }

  private _exportAOA(aoa: any) {
    console.log(aoa);
    let worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);
    let workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    let excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    return new Blob([excelBuffer], { type: this.fileType });
  }
}
