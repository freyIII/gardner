import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Professor } from 'src/app/models/professor.interface';
import { QueryParams } from 'src/app/models/queryparams.interface';
import { Schedule } from 'src/app/models/schedule.interface';
import { Strand } from 'src/app/models/strand.interface';
import { Subject } from 'src/app/models/subject.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilService } from 'src/app/services/util/util.service';
import { AutocompleteApi } from 'src/app/shared/components/autocomplete-api/autocomplete-api.component';
import { DialogAreYouSureComponent } from 'src/app/shared/dialogs/dialog-are-you-sure/dialog-are-you-sure.component';
import { ScheduleFormComponent } from '../schedule-form/schedule-form.component';
import {
  STRAND_AUTOCOMPLETE_CONFIG,
  ROOM_AUTOCOMPLETE_CONFIG,
  SCHEDULE_AUTOCOMPLETE_CONFIG,
  MORNING_TIMES,
  AFTERNOOON_TIMES,
} from './schedule-creator.configs';

@Component({
  selector: 'app-schedule-creator',
  templateUrl: './schedule-creator.component.html',
  styleUrls: ['./schedule-creator.component.scss'],
})
export class ScheduleCreatorComponent implements OnInit {
  strandAutoConfig: AutocompleteApi = STRAND_AUTOCOMPLETE_CONFIG;
  roomAutoConfig: AutocompleteApi = ROOM_AUTOCOMPLETE_CONFIG;
  scheduleAutoConfig: AutocompleteApi = SCHEDULE_AUTOCOMPLETE_CONFIG;
  roomField: any = { label: 'Room' };
  strandField: any = { label: 'Strand' };
  scheduleField: any = { label: 'Schedule', optional: true };
  morningArray = MORNING_TIMES;
  afternoonArray = AFTERNOOON_TIMES;
  scheds: any = [];
  weekArray: any = [
    { day: 'Monday' },
    { day: 'Tuesday' },
    { day: 'Wednesday' },
    { day: 'Thursday' },
    { day: 'Friday' },
  ];

  scheduleFormGroup: FormGroup;
  selectedShift: string = 'Morning';
  query: any = {};
  subjects: Array<Subject> = [];
  professors: Array<Professor> = [];
  loading: boolean = false;
  loadSched: boolean = false;
  saving: boolean = false;

  title: string;
  message: string;
  schedDetails: Schedule;

  apiObserver = {
    next: (response: any) => {
      let pastTense = this.data.action.concat(
        this.data.action.endsWith('e') ? 'd' : 'ed'
      );
      this.message = `Successfully ${pastTense}: ${
        this.scheduleFormGroup.get('name').value
      } !`;
      this.sb.open(this.message, 'Okay', {
        duration: 3500,
        panelClass: ['success'],
      });
      this.saving = false;
      this.dialogRef.close(true);
    },
    error: (err: any) => {
      console.log(err);
      this.saving = false;
      this.sb.open(
        'Error: ' + (err.error.message || 'Something went wrong'),
        'Okay',
        {
          duration: 3500,
          panelClass: ['failed'],
        }
      );
    },
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
    private sb: MatSnackBar,
    private dialog: MatDialog,
    private util: UtilService,
    private dialogRef: MatDialogRef<ScheduleCreatorComponent>,
    private fb: FormBuilder
  ) {
    this.scheduleFormGroup = this.fb.group({
      name: '',
      yearLevel: '',
      semester: '',
      shift: 'Morning',
      _strand: '',
      _room: '',
    });
    this.title = this.data.title;
    if (data.action === 'update') {
      this.schedDetails = util.deepCopy(data.form);

      this.scheduleFormGroup.patchValue(this.schedDetails);
      this.strandField.default = this.schedDetails._strand.name;
      this.roomField.default = this.schedDetails._room.name;
      this.get(
        this.schedDetails._strand,
        this.schedDetails.yearLevel,
        this.schedDetails.semester
      );
      this.scheds = this.schedDetails.scheds;
      this._getWeekArraySched();
    }
  }

  ngOnInit(): void {}

  get(strand: Strand, yearLevel: string, semester) {
    console.log(strand);
    this.query = {
      strand: {
        field: '_id',
        operator: '[in]=',
        value: strand._subjects,
      },
      yearLevel: {
        field: 'yearLevel',
        operator: '=',
        value: yearLevel,
      },
      semester: {
        field: 'semester',
        operator: '=',
        value: semester,
      },
    };
    if (Object.keys(this.query).length === 3) {
      this.getSubjects();
    }
  }

  autocompleteListener(event: any, type: string) {
    if (type === 'strand') {
      this.scheduleFormGroup.get('_strand').setValue(event);
      this.query[type] = {
        field: '_id',
        operator: '[in]=',
        value: event._subjects.map((subjects) => subjects._id),
      };

      if (Object.keys(this.query).length === 3) {
        this.getSubjects();
      }
    }
    if (type === 'room') {
      this.scheduleFormGroup.get('_room').setValue(event);
    }
  }

  selectChange(event: any, type: string) {
    if (type !== 'shift') {
      if (type === 'yearLevel' || type === 'semester') {
        this.query[type] = {
          field: type,
          operator: '=',
          value: event,
        };
      }

      if (Object.keys(this.query).length === 3) {
        this.getSubjects();
      }
    } else {
      this.selectedShift = event;
    }
  }

  getSubjects() {
    this.weekArray = [
      { day: 'Monday' },
      { day: 'Tuesday' },
      { day: 'Wednesday' },
      { day: 'Thursday' },
      { day: 'Friday' },
    ];
    this.loading = true;
    this.subjects = [];
    this.professors = [];
    let query: QueryParams = {};
    let tempArr: any = [];
    for (let value of Object.values(this.query)) {
      tempArr.push(value);
    }
    query.find = tempArr;
    console.log(this.query);
    this.api.subject.getAllSubjects(query).subscribe(
      (res) => {
        this.subjects = res.env.subjects;
        console.log(res.total_docs);
        if (res.total_docs) this.getProfessors();
        else this.loading = false;
      },
      (err) => {
        this.sb.open('Error: ' + err.error.message, 'Okay', {
          duration: 5000,
        });
        this.loading = false;
      }
    );
  }
  getProfessors() {
    let query: QueryParams = {};
    let tempQuery: any = {
      field: '_subjects',
      operator: '[in]=',
      value: this.subjects.map((subject) => subject._id),
    };

    query.find = [tempQuery];

    this.api.professor.getAllProfessors(query).subscribe(
      (res) => {
        this.professors = res.env.professors;
        for (let prof of this.professors) {
          prof._subjects = prof._subjects.map((subj) => subj._id);
        }
        this.loading = false;
      },
      (err) => {
        this.sb.open('Error: ' + err.error.message, 'Okay', {
          duration: 5000,
        });
        this.loading = false;
      }
    );
  }

  onRowClick(professor: Professor, subject: Subject) {
    this.dialog
      .open(ScheduleFormComponent, {
        disableClose: true,
        width: '50%',
        data: {
          form: { professor, subject },
          shift: this.scheduleFormGroup.get('shift').value,
          action: 'add',
          title: 'Create Schedule',
        },
      })
      .afterClosed()
      .subscribe((res) => {
        console.log(res);
        if (res) {
          this.scheds.push(res);
          this.loadSched = true;
          this._getWeekArraySched();
        }
      });
  }
  isDisabled() {
    return false;
  }

  _getWeekArraySched() {
    let days: any = [];
    for (let array of this.weekArray) {
      let scheds: any = {};

      for (let sched of this.scheds) {
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

  onSave() {
    this.dialog
      .open(DialogAreYouSureComponent, {
        data: {
          header: 'Before you proceed...',
          msg: `${this.data.action}  ${
            this.scheduleFormGroup.get('name').value
          }`,
        },
      })
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.saving = true;
          if (this.data.action === 'add') {
            this.onAdd();
          } else {
            this.onUpdate();
          }
        }
      });
  }

  onAdd() {
    this.sb.open(
      `Adding ${this.scheduleFormGroup.get('name').value}...`,
      undefined
    );
    let schedsCopy = this.util.deepCopy(this.scheds);
    for (let sched of schedsCopy) {
      sched._professor = sched._professor._id;
      sched._subject = sched._subject._id;
    }

    console.log(schedsCopy);
    let body = {
      ...this.scheduleFormGroup.getRawValue(),
      scheds: schedsCopy,
    };

    console.log(body);
    this.api.schedule.createSchedule(body).subscribe(this.apiObserver);
  }

  onUpdate() {
    this.sb.open(
      `Updating ${this.scheduleFormGroup.get('name').value}...`,
      undefined
    );
    let schedsCopy = this.util.deepCopy(this.scheds);
    for (let sched of schedsCopy) {
      sched._professor = sched._professor._id;
      sched._subject = sched._subject._id;
    }

    let body = {
      ...this.scheduleFormGroup.getRawValue(),
      scheds: schedsCopy,
    };
    console.log(body);
    this.api.schedule
      .updateSchedule(this.data.form._id, body)
      .subscribe(this.apiObserver);
  }

  onCancel() {
    if (!this.saving) {
      if (this.scheduleFormGroup.dirty) {
        this.dialog
          .open(DialogAreYouSureComponent, {
            data: {
              header: 'Before you proceed...',
              msg:
                this.data.action === 'add'
                  ? 'stop adding new schedule'
                  : `stop editing the details of ${this.data.form.name} `,
            },
          })
          .afterClosed()
          .subscribe((confirm: boolean) => {
            if (confirm) {
              this.dialogRef.close(false);
            }
          });
      } else {
        this.dialogRef.close(false);
      }
    }
  }

  onDelete() {
    this.dialog
      .open(DialogAreYouSureComponent, {
        data: {
          header: 'Before you proceed...',
          msg: `delete ${this.data.form.name}`,
        },
      })
      .afterClosed()
      .subscribe((confirm: boolean) => {});
    this.sb.open(`Deleting ${this.data.form.value.name}...`, undefined);
    this.api.subject
      .deleteSubject(this.data.form._id)
      .subscribe(this.apiObserver);
  }

  onRemove(time: string) {
    this.dialog
      .open(DialogAreYouSureComponent, {
        data: {
          header: 'Before you proceed...',
          msg: `remove`,
        },
      })
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          for (let week of this.weekArray) {
            for (let [key, value] of Object.entries(week.scheds)) {
              if (key === time && typeof value === 'object') {
                for (let [k, val] of Object.entries(value)) {
                  if (k === 'shift' && val === this.selectedShift) {
                    delete week.scheds[key];
                  }
                }
              }
            }
          }
          this.scheds.forEach((sched, index) => {
            if (
              sched.startTime === time &&
              sched.shift === this.selectedShift
            ) {
              this.scheds.splice(index, 1);
            }
          });
        }
      });
  }
}
