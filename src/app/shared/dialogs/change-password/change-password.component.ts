import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { resetUser } from 'src/app/user/user.action';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  credentialPassword = this.fb.group(
    {
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmNewPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    },
    {
      validator: this.matchPassword('newPassword', 'confirmNewPassword'),
    }
  );
  me: any;
  pwMsg: string = '';

  loading: boolean = false;
  isLoggingOut: boolean = false;
  saving: boolean = false;
  hideCurrent: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmNewPassword: boolean = true;
  pwError: boolean = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private fb: FormBuilder,
    private auth: AuthService,
    private sb: MatSnackBar,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<{ user: User }>
  ) {}

  ngOnInit(): void {}

  get registerFormControl() {
    return this.credentialPassword.controls;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.save();
  }

  onLogout() {
    this.isLoggingOut = true;
    this.sb.open('Logging Out...', undefined, { duration: 1500 });
    this.auth.logout().subscribe(
      (res: any) => {
        localStorage.removeItem('SESSION_TOKEN');
        localStorage.removeItem('SESSION_AUTH');
        this.store.dispatch(resetUser());
        this.router.navigate(['/login']);
        this.isLoggingOut = false;
        this.dialogRef.close();
      },
      (err: any) => {
        this.isLoggingOut = false;
        this.dialogRef.close();
        this.sb.open(err.error.message, undefined, { duration: 1500 });
      }
    );
  }

  matchPassword(newPassword: string, confirmNewPassword: string) {
    return (fb: FormGroup) => {
      const newPasswordControl = fb.controls[newPassword];
      const confirmNewPasswordControl = fb.controls[confirmNewPassword];

      if (!newPasswordControl || !confirmNewPasswordControl) {
        return null;
      }

      if (
        confirmNewPasswordControl.errors &&
        !confirmNewPasswordControl.errors.passwordMismatch
      ) {
        return null;
      }

      if (newPasswordControl.value !== confirmNewPasswordControl.value) {
        confirmNewPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmNewPasswordControl.setErrors(null);
      }
      return null;
    };
  }

  pwCheck() {
    let formRawValue = this.credentialPassword.getRawValue();
    let dataCredential = {
      currentPassword: formRawValue.currentPassword,
      newPassword: formRawValue.newPassword,
      confirmNewPassword: formRawValue.confirmNewPassword,
    };

    if (
      dataCredential.currentPassword !== '' &&
      dataCredential.newPassword !== '' &&
      dataCredential.confirmNewPassword !== ''
    ) {
      if (dataCredential.newPassword !== dataCredential.confirmNewPassword) {
        this.pwError = true;
        this.pwMsg = 'Passwords did not match';
      } else if (
        dataCredential.currentPassword === dataCredential.newPassword ||
        dataCredential.currentPassword === dataCredential.confirmNewPassword
      ) {
        this.pwError = true;
        this.pwMsg = 'New password must not be the same as old password';
      } else {
        this.pwError = false;
      }
    }
  }

  save() {
    this.saving = true;
    let formRawValue = this.credentialPassword.getRawValue();
    let dataCredential = {
      currentPassword: formRawValue.currentPassword,
      newPassword: formRawValue.newPassword,
      confirmNewPassword: formRawValue.confirmNewPassword,
    };

    this.sb.open('Changing your password...', undefined);

    this.auth.updatePassword(dataCredential).subscribe(
      (res: any) => {
        this.sb.open('Password Successfully Saved', undefined, {
          duration: 1500,
          panelClass: ['success'],
        });
        this.saving = false;
        this.dialogRef.close(true);
      },
      (err: any) => {
        this.sb.open(
          err.error.message ||
            'Error: ' + (err.error.message || 'Something went wrong'),
          'Okay',
          {
            duration: 3500,
            panelClass: ['failed'],
          }
        );
        this.saving = false;
      }
    );
  }
}
