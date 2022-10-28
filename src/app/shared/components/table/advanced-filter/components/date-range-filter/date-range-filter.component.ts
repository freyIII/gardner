import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-table-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.scss'],
})
export class DateRangeFilterComponent implements OnInit, OnDestroy {
  @Input() label: string;
  @Input() max: Date;
  @Output() onFormChange: EventEmitter<{
    start?: string;
    end?: string;
  }> = new EventEmitter();

  destroyed: ReplaySubject<boolean> = new ReplaySubject(1);

  dateRangeGroup: FormGroup;
  constructor(private fb: FormBuilder) {
    this.dateRangeGroup = this.fb.group({
      start: '',
      end: '',
    });

    this.dateRangeGroup.valueChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this._emitValues();
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  reset() {
    this.dateRangeGroup.reset();
  }

  private _emitValues() {
    const toEmit = {};
    const dates = this.dateRangeGroup.getRawValue();

    if (dates.start) {
      const start = this._dateToPhTime(dates.start);
      start.setHours(0, 0, 0, 0);
      toEmit['start'] = this._removeTimeOffset(start)
        .toISOString()
        .slice(0, -1);
    }

    if (dates.end) {
      const end = this._dateToPhTime(dates.end);
      end.setHours(23, 59, 59, 999);
      toEmit['end'] = this._removeTimeOffset(end).toISOString().slice(0, -1);
    }

    this.onFormChange.emit(toEmit);
  }

  private _dateToPhTime(date: Date) {
    date.toLocaleString('en-US', {
      timeZone: 'Asia/Singapore',
    });

    return date;
  }

  private _removeTimeOffset(date: Date) {
    const noOffset = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return noOffset;
  }
}
