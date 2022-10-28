import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/api/auth/auth.service';

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
    public router: Router
  ) {}

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
    this.auth.login(this.credentials.getRawValue()).subscribe(
      (res: any) => {
        if (
          res.env.user.type === 'Admin' ||
          res.env.user.type === 'Assistant Admin' ||
          res.env.user.type === 'Superadmin'
        ) {
          localStorage.setItem('SESSION_TOKEN', res.session_token);
          localStorage.setItem('SESSION_AUTH', res.token);
          this.sb
            .open('Successful Login. Redirecting to profile...', undefined, {
              duration: 1500,
              panelClass: ['success'],
            })
            .afterDismissed()
            .subscribe(() => {
              this.router.navigate(['/portal']);
            });
        } else {
          this.credentials.reset();
          this.sb.open('Invalid Access.', 'Okay', {
            duration: 1500,
            panelClass: ['failed'],
          });

          this.loggingIn = false;
        }
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
}
