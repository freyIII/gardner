import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from 'src/app/services/api/auth/auth.service';
import { MyErrorStateMatcher } from 'src/app/configs/errorStateMatcher';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  year: number = new Date().getFullYear();
  matcher: MyErrorStateMatcher = new MyErrorStateMatcher();
  details: any = {};

  passwrd = this.fb.group({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    passwordConfirm: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  showPassword1: boolean = false;
  showPassword2: boolean = false;
  submitting: boolean = false;
  loading: boolean = true;

  passwords = {
    password: '',
    passwordConfirm: '',
  };
  valid: boolean = false;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private sb: MatSnackBar
  ) {
    this.token = this.route.snapshot.paramMap.get('id') || '';
    this.auth.verifyResetPassToken(this.token).subscribe(
      (res: any) => {
        this.details = res.env.user;
        this.loading = false;
      },
      (err: any) => {
        this.loading = false;
        this.goToLogin();
      }
    );
  }

  ngOnInit(): void {}
  onPasswordChange(event: any) {
    console.log(event);
    this.passwords = event.data;
    this.valid = event.valid;
  }
  onSubmit() {
    this.submitting = true;
    this.sb.open('Changing your password...', undefined);
    this.auth.resetPassword(this.token, this.passwords).subscribe(
      (res: any) => {
        this.sb.open(
          'Successfully changed password. Try Logging-in using your new password',
          undefined,
          {
            duration: 3000,
            panelClass: ['success'],
          }
        );
        this.submitting = false;
        this.goToLogin();
      },
      (err: any) => {
        this.sb.open(
          'Error: ' + (err.error.message || 'Something went wrong'),
          'Okay',
          {
            duration: 3000,
            panelClass: ['failed'],
          }
        );
        this.submitting = false;
      }
    );
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
