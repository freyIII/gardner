import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { QueryParams } from 'src/app/models/queryparams.interface';
import { Schedule } from 'src/app/models/schedule.interface';
import { Strand } from 'src/app/models/strand.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilService } from 'src/app/services/util/util.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  AutocompleteApi,
  AutocompleteApiComponent,
} from 'src/app/shared/components/autocomplete-api/autocomplete-api.component';
import {
  MORNING_TIMES,
  AFTERNOOON_TIMES,
  STRAND_AUTOCOMPLETE_CONFIG,
  ROOM_AUTOCOMPLETE_CONFIG,
} from '../schedule/schedule-creator/schedule-creator.configs';
import { E } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('strand') strand: AutocompleteApiComponent;
  @ViewChild('room') room: AutocompleteApiComponent;
  selectedShift: string = 'Morning';
  strandAutoConfig: AutocompleteApi = this.util.deepCopy(
    STRAND_AUTOCOMPLETE_CONFIG
  );
  roomAutoConfig: AutocompleteApi = this.util.deepCopy(
    ROOM_AUTOCOMPLETE_CONFIG
  );
  roomField: any = { label: 'Room', optional: true };
  strandField: any = { label: 'Strand', optional: true };
  selectedYearLevel: string = 'All';
  selectedSemester: string = 'All';
  selectedStrand: any;
  selectedRoom: any;
  selectedSched: Schedule;
  weekArray: any = [
    { day: 'Monday' },
    { day: 'Tuesday' },
    { day: 'Wednesday' },
    { day: 'Thursday' },
    { day: 'Friday' },
  ];
  morningArray = MORNING_TIMES;
  afternoonArray = AFTERNOOON_TIMES;
  loadSched: boolean = false;
  loading: boolean = false;
  scheds: Array<Schedule> = [];
  generating: boolean = false;

  query: any = {};

  constructor(
    private api: ApiService,
    private util: UtilService,
    private sb: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAllSchedule();
  }

  getAllSchedule() {
    this.loading = true;
    let query: QueryParams = {};
    let tempArr: any = [];
    console.log(this.query);
    if (Object.keys(this.query).length) {
      for (let value of Object.values(this.query)) {
        if (value) tempArr.push(value);
      }
    }

    query.find = tempArr;

    this.api.schedule.getAllSchedules(query).subscribe((res) => {
      this.scheds = res.env.schedules;
      this.loading = false;
    });
  }

  onSelectSched(sched: Schedule) {
    this.selectedSched = sched;
    this._getWeekArraySched(sched.scheds);
  }

  autocompleteListener(event: any, type: string) {
    if (type === 'strand') {
      this.selectedStrand = event;
      if (event) {
        this.query[type] = {
          field: '_strand',
          operator: '=',
          value: event._id,
        };
      }
    } else {
      this.selectedRoom = event;
      if (event) {
        this.query[type] = {
          field: '_room',
          operator: '=',
          value: event._id,
        };
      }
    }

    this.getAllSchedule();
  }

  onRemove(type: string) {
    if (type === 'strand') {
      this.selectedStrand = undefined;
      this.strand.selectedOption = '';
      this.strand.autocompleteControl.setValue('');
      this.strand.filteredOptions =
        this.strand.autocompleteControl.valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((keyword) => this.strand._filter(keyword))
        );
    } else {
      this.selectedRoom = undefined;
      this.room.selectedOption = '';
      this.room.autocompleteControl.setValue('');
      this.room.filteredOptions =
        this.room.autocompleteControl.valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((keyword) => this.room._filter(keyword))
        );
    }

    delete this.query[type];

    this.getAllSchedule();
  }

  onSelectChange(event: string, type: string) {
    if (event !== 'All') {
      this.query[type] = {
        field: type,
        operator: '=',
        value: event,
      };
    } else {
      delete this.query[type];
    }
    this.getAllSchedule();
  }

  _getWeekArraySched(schedules: any) {
    let days: any = [];
    for (let array of this.weekArray) {
      let scheds: any = {};

      for (let sched of schedules) {
        if (array.day === sched.day) {
          if (sched.shift === 'Morning') {
            let startTimeIndex = this.morningArray.indexOf(sched.startTime);
            let endTimeIndex = this.morningArray.indexOf(sched.endTime);
            if (startTimeIndex !== -1 && endTimeIndex !== -1) {
              sched['distance'] = endTimeIndex - startTimeIndex;
              scheds[this.morningArray[startTimeIndex]] = sched;
            }
          }
          if (sched.shift) {
            let startTimeIndex = this.afternoonArray.indexOf(sched.startTime);
            let endTimeIndex = this.afternoonArray.indexOf(sched.endTime);
            if (startTimeIndex !== -1 && endTimeIndex !== -1) {
              sched['distance'] = endTimeIndex - startTimeIndex;
              scheds[this.afternoonArray[startTimeIndex]] = sched;
            }
          }
        }
      }

      days.push({
        day: array.day,
        scheds: scheds,
      });
    }
    this.weekArray = days;
    this.loadSched = false;
  }

  async download() {
    this.generating = true;
    var sbRef = this.sb.open('Generating PDF...');

    let PDF = new jsPDF('l', 'mm', 'a4');

    let DATA = document.getElementById('sched-div') as HTMLCanvasElement;
    await html2canvas(DATA).then((canvas) => {
      const FILEURI = canvas.toDataURL('image/png');
      PDF.addImage(FILEURI, 'PNG', 0, 5, 280, 200);
    });
    let blob = PDF.output('blob');
    let blobUrl = URL.createObjectURL(blob);
    let iFrame: any = document.createElement('iframe');

    iFrame.style.display = 'none';
    iFrame.src = blobUrl;

    document.body.appendChild(iFrame);
    iFrame.contentWindow.print();
    sbRef.dismiss();
    this.generating = false;
  }
}
