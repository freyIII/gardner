import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { ForgotPasswordComponent } from 'src/app/shared/dialogs/forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  year: number = new Date().getFullYear();
  credentials: FormGroup = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  showPassword: boolean = false;
  loggingIn: boolean = false;
  routerLoad: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private sb: MatSnackBar,
    public router: Router,
    private dialog: MatDialog
  ) {
    this.credentials.get('email').setValue('gardnersuperadmin@mailsac.com');
    this.credentials.get('password').setValue('rakuHBDQ6)');
  }

  ngOnInit(): void {
    if (
      localStorage.getItem('SESSION_TOKEN') &&
      localStorage.getItem('SESSION_AUTH')
    ) {
      this.auth.me().subscribe((res: any) => {
        this.router.navigate(['/portal']);
      });
    }
  }

  onSubmit() {
    this.loggingIn = true;
    this.auth.login(this.credentials.getRawValue()).subscribe(
      (res: any) => {
        this.router.navigate(['/portal']);

        // if (
        //   res.env.user.type === 'Admin' ||
        //   res.env.user.type === 'Assistant Admin' ||
        //   res.env.user.type === 'Superadmin'
        // ) {
        //   localStorage.setItem('SESSION_TOKEN', res.session_token);
        //   localStorage.setItem('SESSION_AUTH', res.token);
        //   this.sb
        //     .open('Successful Login. Redirecting to profile...', undefined, {
        //       duration: 1500,
        //       panelClass: ['success'],
        //     })
        //     .afterDismissed()
        //     .subscribe(() => {
        //       this.router.navigate(['/portal']);
        //     });
        // } else {
        //   this.credentials.reset();
        //   this.sb.open('Invalid Access.', 'Okay', {
        //     duration: 1500,
        //     panelClass: ['failed'],
        //   });

        //   this.loggingIn = false;
        // }
      },
      (err) => {
        this.credentials.reset();
        this.sb.open(
          err.error.message || 'Access credentials incorrect',
          'Okay',
          {
            duration: 1500,
            panelClass: ['failed'],
          }
        );
        this.loggingIn = false;
      }
    );
  }
  forgotPassword() {
    this.dialog
      .open(ForgotPasswordComponent, {
        panelClass: 'dialog-responsive-light',
        disableClose: true,
        data: this.credentials.getRawValue().email || '',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((res: any) => {});
  }
}
