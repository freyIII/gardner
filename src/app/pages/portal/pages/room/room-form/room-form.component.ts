import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Section } from 'src/app/models/form.interface';
import { User } from 'src/app/models/user.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilService } from 'src/app/services/util/util.service';
import { NewFormComponent } from 'src/app/shared/components/new-form/new-form.component';
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
    private util: UtilService
  ) {
    if (data.action === 'update') {
      this.roomInterface = this.util.deepCopy(data.form);
    }
  }

  ngOnInit(): void {
    this.title = this.data.title;
  }

  onSubmit() {
    this.saving = true;
    if (this.data.action === 'add') {
      this.onAdd();
    } else {
      this.onUpdate();
    }
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

  onStatusChange(action: string) {
    let msg = '';
    if (action === 'Deleted') {
      msg = 'Deleting';
    } else if (action === 'Active') {
      msg = 'Activating';
    } else if (action === 'Inactive') {
      msg = 'Deactivating';
    }
    this.sb.open(`${msg} ${this.roomDetails.form.value.name}...`, undefined);
    this.api.room
      .updateRoomStatus(this.data.form._id, action)
      .subscribe(this.apiObserver);
  }

  onCancel() {
    if (!this.saving) this.dialogRef.close(false);
  }
}
