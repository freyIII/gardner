import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Section } from 'src/app/models/form.interface';
import { User } from 'src/app/models/user.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilService } from 'src/app/services/util/util.service';
import { NewFormComponent } from 'src/app/shared/components/new-form/new-form.component';
import { DialogAreYouSureComponent } from 'src/app/shared/dialogs/dialog-are-you-sure/dialog-are-you-sure.component';
import { ROOM_FORM } from './room-form.configs';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss'],
})
export class RoomFormComponent implements OnInit {
  @ViewChild('roomDetails') roomDetails!: NewFormComponent;
  roomFormField: Section[] = JSON.parse(JSON.stringify(ROOM_FORM));
  roomInterface: any;
  message: string;
  saving: boolean;
  resetting: boolean = false;
  title: string;

  apiObserver = {
    next: (response: any) => {
      let pastTense = this.data.action.concat(
        this.data.action.endsWith('e') ? 'd' : 'ed'
      );
      this.message = `Successfully ${pastTense}: ${this.roomDetails.form.value.name} !`;
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
    private dialogRef: MatDialogRef<RoomFormComponent>,
    private sb: MatSnackBar,
    private api: ApiService,
    private util: UtilService,
    private dialog: MatDialog
  ) {
    if (data.action === 'update') {
      this.roomInterface = this.util.deepCopy(data.form);
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
          msg: `${this.data.action} ${this.roomDetails.form.value.name}`,
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
    this.sb.open(`Adding ${this.roomDetails.form.value.name}...`, undefined);
    let body = { ...this.roomDetails.form.getRawValue() };

    this.api.room.createRoom(body).subscribe(this.apiObserver);
  }

  onUpdate() {
    this.sb.open(`Updating ${this.roomDetails.form.value.name}...`, undefined);
    let body = { ...this.roomDetails.form.getRawValue() };
    this.api.room
      .updateRoom(this.data.form._id, body)
      .subscribe(this.apiObserver);
  }

  onDelete() {
    this.sb.open(`Deleting ${this.roomDetails.form.value.name}...`, undefined);
    this.api.room
      .updateRoomStatus(this.data.form._id, 'Deleted')
      .subscribe(this.apiObserver);
  }

  onCancel() {
    if (!this.saving) {
      if (this.roomDetails.form.dirty) {
        this.dialog
          .open(DialogAreYouSureComponent, {
            data: {
              header: 'Before you proceed...',
              msg:
                this.data.action === 'add'
                  ? 'stop adding new room'
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
