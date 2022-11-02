import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Section } from 'src/app/models/form.interface';
import { Professor } from 'src/app/models/professor.interface';
import { Subject } from 'src/app/models/subject.interface';
import { UtilService } from 'src/app/services/util/util.service';
import { NewFormComponent } from 'src/app/shared/components/new-form/new-form.component';
import { DialogAreYouSureComponent } from 'src/app/shared/dialogs/dialog-are-you-sure/dialog-are-you-sure.component';
import {
  MORNING_TIMES,
  AFTERNOOON_TIMES,
} from '../schedule-creator/schedule-creator.configs';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.scss'],
})
export class ScheduleFormComponent implements OnInit {
  title: string;
  professorDetails: Professor;
  subjectDetails: Subject;
  morningArray = MORNING_TIMES;
  afternoonArray = AFTERNOOON_TIMES;
  formGroup: FormGroup;
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  professor: string;
  subject: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private util: UtilService,
    private fb: FormBuilder,
    private sb: MatSnackBar,
    private dialogRef: MatDialogRef<ScheduleFormComponent>,
    private dialog: MatDialog
  ) {
    this.title = this.data.title;
    this.professorDetails = this.util.deepCopy(this.data.form.professor);
    this.subjectDetails = this.util.deepCopy(this.data.form.subject);
    this.professor = `${this.professorDetails.firstName} ${this.professorDetails.lastName}`;
    this.subject = `${this.subjectDetails.name}`;
    this.formGroup = this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      shift: data.shift,
      _professor: this.professorDetails,
      _subject: this.subjectDetails,
      day: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSave() {
    this.dialog
      .open(DialogAreYouSureComponent, {
        data: {
          header: 'Before you proceed...',
          msg: `add`,
        },
      })
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          let startTimeIndex: number;
          let endTimeIndex: number;
          let startTime = this.formGroup.get('startTime').value;
          let endTime = this.formGroup.get('endTime').value;
          if (this.data.shift === 'Morning') {
            this.morningArray.forEach((arr, index) => {
              if (arr === startTime) {
                startTimeIndex = index;
              }
              if (arr === endTime) {
                endTimeIndex = index;
              }
            });
          } else {
            this.afternoonArray.forEach((arr, index) => {
              if (arr === startTime) {
                startTimeIndex = index;
              }
              if (arr === endTime) {
                endTimeIndex = index;
              }
            });
          }
          console.log(startTimeIndex, endTimeIndex);
          if (startTimeIndex > endTimeIndex) {
            this.sb.open('Error: End time is less than Start time', 'Okay', {
              duration: 3500,
              panelClass: ['failed'],
            });
          } else if (startTimeIndex === endTimeIndex) {
            this.sb.open('Error: Start time is same as End time ', 'Okay', {
              duration: 3500,
              panelClass: ['failed'],
            });
          } else {
            this.formGroup.getRawValue();
            this.dialogRef.close(this.formGroup.getRawValue());
          }
        }
      });
  }
  onCancel() {
    if (this.formGroup.dirty) {
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
