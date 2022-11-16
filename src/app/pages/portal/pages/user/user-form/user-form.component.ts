import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Section } from 'src/app/models/form.interface';
import { Role } from 'src/app/models/role.interface';
import { User } from 'src/app/models/user.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilService } from 'src/app/services/util/util.service';
import { AutocompleteApi } from 'src/app/shared/components/autocomplete-api/autocomplete-api.component';
import { NewFormComponent } from 'src/app/shared/components/new-form/new-form.component';
import { DialogAreYouSureComponent } from 'src/app/shared/dialogs/dialog-are-you-sure/dialog-are-you-sure.component';
import { ROLE_AUTOCOMPLETE_CONFIG, USER_FORM } from './user-form.configs';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  @ViewChild('userDetails') userDetails!: NewFormComponent;

  roleAutoConfig: AutocompleteApi = this.util.deepCopy(
    ROLE_AUTOCOMPLETE_CONFIG
  );

  roleField: any = { label: 'Role' };
  selectedRole: Role;
  userFormField: Section[] = JSON.parse(JSON.stringify(USER_FORM));
  userInterface: any;
  action: string;
  message: string;
  saving: boolean;
  title: string;

  apiObserver = {
    next: (response: any) => {
      let pastTense = this.action.concat(
        this.action.endsWith('e') ? 'd' : 'ed'
      );
      this.message = `Successfully ${pastTense}: ${this.userDetails.form.value.firstName} ${this.userDetails.form.value.lastName}!`;
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
    private dialogRef: MatDialogRef<UserFormComponent>,
    private sb: MatSnackBar,
    private api: ApiService,
    private util: UtilService,
    private dialog: MatDialog
  ) {
    if (data.action === 'update') {
      this.userInterface = this.util.deepCopy(data.form);
      this.roleField.default = this.userInterface._role.name;
    }
  }

  ngOnInit(): void {
    this.title = this.data.title;
    this.action = this.util.deepCopy(this.data.action);
  }

  autocompleteListener(role: Role) {
    this.selectedRole = role;
  }

  onSubmit() {
    this.dialog
      .open(DialogAreYouSureComponent, {
        data: {
          header: 'Before you proceed...',
          msg: `${this.data.action} ${this.userDetails.form.value.firstName} ${this.userDetails.form.value.lastName}`,
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
      `Adding ${this.userDetails.form.value.firstName} ${this.userDetails.form.value.lastName}...`,
      undefined
    );
    let body = {
      ...this.userDetails.form.getRawValue(),
    };
    if (this.selectedRole) {
      body['_role'] = this.selectedRole._id;
    }
    body['mobileNumber'] = '+63' + body.mobileNumber;
    this.api.user.createUser(body).subscribe(this.apiObserver);
  }

  onUpdate() {
    this.sb.open(
      `Updating ${this.userDetails.form.value.firstName} ${this.userDetails.form.value.lastName}...`,
      undefined
    );

    let body = {
      ...this.userDetails.form.getRawValue(),
    };

    if (this.selectedRole) {
      body['_role'] = this.selectedRole._id;
    }
    body['mobileNumber'] = '+63' + body.mobileNumber;
    this.api.user
      .updateUser(this.data.form._id, body)
      .subscribe(this.apiObserver);
  }

  onDelete() {
    this.action = 'delete';
    this.dialog
      .open(DialogAreYouSureComponent, {
        data: {
          header: 'Before you proceed...',
          msg: `delete ${this.data.form.firstName} ${this.data.form.lastName}`,
        },
      })
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.saving = true;
          this.sb.open(
            `Deleting ${this.data.form.firstName} ${this.data.form.lastName}...`,
            undefined
          );
          this.api.user
            .deleteUser(this.data.form._id)
            .subscribe(this.apiObserver);
        }
      });
  }

  onCancel() {
    let changed: boolean =
      this.userDetails.form.dirty &&
      (this.data.action === 'update'
        ? !this.dataChanges()
        : !this.util.emptyDetails(this.userDetails.form.getRawValue()));

    if (changed) {
      this.dialog
        .open(DialogAreYouSureComponent, {
          data: {
            header: 'Before you proceed...',
            msg:
              this.data.action === 'add'
                ? 'stop adding new user'
                : `stop editing the details of ${this.data.form.firstName} ${this.data.form.lastName}`,
          },
        })
        .afterClosed()
        .subscribe((confirm: boolean) => {
          if (confirm) {
            this.dialogRef.close();
          }
        });
    } else {
      this.dialogRef.close();
    }
  }

  dataChanges() {
    let changes: boolean = true;
    let originalDetail = JSON.parse(JSON.stringify(this.data.form));
    if (
      originalDetail.mobileNumber &&
      originalDetail.mobileNumber.length !== 10
    ) {
      originalDetail.mobileNumber = originalDetail.mobileNumber.slice(3);
    }

    changes = this.util.dataChanges(
      this.userDetails.form.getRawValue(),
      originalDetail
    );

    return changes;
  }
}
