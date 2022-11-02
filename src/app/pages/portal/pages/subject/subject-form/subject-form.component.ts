import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Section } from 'src/app/models/form.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilService } from 'src/app/services/util/util.service';
import { NewFormComponent } from 'src/app/shared/components/new-form/new-form.component';
import { DialogAreYouSureComponent } from 'src/app/shared/dialogs/dialog-are-you-sure/dialog-are-you-sure.component';
import { SUBJECT_FORM } from './subject-form.configs';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.scss'],
})
export class SubjectFormComponent implements OnInit {
  @ViewChild('subjectDetails') subjectDetails!: NewFormComponent;
  subjectFormField: Section[] = JSON.parse(JSON.stringify(SUBJECT_FORM));
  subjectInterface: any;
  message: string;
  saving: boolean;
  resetting: boolean = false;
  title: string;

  apiObserver = {
    next: (response: any) => {
      let pastTense = this.data.action.concat(
        this.data.action.endsWith('e') ? 'd' : 'ed'
      );
      this.message = `Successfully ${pastTense}: ${this.subjectDetails.form.value.name} !`;
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
    private dialogRef: MatDialogRef<SubjectFormComponent>,
    private sb: MatSnackBar,
    private api: ApiService,
    private util: UtilService,
    private dialog: MatDialog
  ) {
    if (data.action === 'update') {
      this.subjectInterface = this.util.deepCopy(data.form);
    }
  }

  ngOnInit(): void {
    this.title = this.data.title;
  }

  onSubmit() {
    this.dialog
      .open(DialogAreYouSureComponent, {
        data: {
          header: 'Before you proceed...',
          msg: `${this.data.action} ${this.subjectDetails.form.value.name}`,
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
    this.sb.open(`Adding ${this.subjectDetails.form.value.name}...`, undefined);
    let body = { ...this.subjectDetails.form.getRawValue() };

    this.api.subject.createSubject(body).subscribe(this.apiObserver);
  }

  onUpdate() {
    this.sb.open(
      `Updating ${this.subjectDetails.form.value.name}...`,
      undefined
    );
    let body = { ...this.subjectDetails.form.getRawValue() };
    this.api.subject
      .updateSubject(this.data.form._id, body)
      .subscribe(this.apiObserver);
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
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.saving = true;
          this.sb.open(`Deleting ${this.data.form.name}...`, undefined);
          this.api.subject
            .deleteSubject(this.data.form._id)
            .subscribe(this.apiObserver);
        }
      });
  }

  onCancel() {
    if (!this.saving) {
      if (this.subjectDetails.form.dirty) {
        this.dialog
          .open(DialogAreYouSureComponent, {
            data: {
              header: 'Before you proceed...',
              msg:
                this.data.action === 'add'
                  ? 'stop adding new subject'
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
}
