import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/api/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  leftButtonText: string = 'Cancel';
  rightButtonText: string = 'Send';

  credential = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  saving: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    public fb: FormBuilder,
    private sb: MatSnackBar,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.credential.setValue({ email: this.data });
  }

  onSubmit() {
    this.saving = true;
    this.sb.open(
      `Sending reset password link to ${this.credential.getRawValue().email}`,
      undefined
    );
    this.auth.forgotPassword(this.credential.getRawValue().email).subscribe(
      (res: any) => {
        if (res) {
          this.saving = false;
          this.sb.open('We have e-mailed your reset password link', 'Okay', {
            duration: 3500,
            panelClass: ['success'],
          });
          this.dialogRef.close();
        }
      },
      (err: any) => {
        this.saving = false;
        this.sb.open(
          'Error: ' + (err.error.message || 'Something went wrong'),
          'Okay',
          {
            duration: 3500,
            panelClass: ['failed'],
          }
        );
      }
    );
  }
}
