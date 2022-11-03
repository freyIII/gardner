import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { ResetPasswordModule } from './reset-password.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
} from '@angular/core/testing';

import { ResetPasswordComponent } from './reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        MaterialModule,
        ResetPasswordModule,
        ComponentsModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [ResetPasswordComponent],
      providers: [AuthService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    component.loading = false;
    component.details = {
      email: 'asdasd@gmail.com',
      firstName: 'asdlhjasd',
      lastName: 'asdajidasd',
    };
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation Testing', () => {
    it('password inputs must be have min length of 8', () => {
      component.passwrd.setValue({
        password: '123',
        passwordConfirm: '321',
      });

      expect(component.passwrd.valid).toBeFalse();
    });

    it('password inputs must be required', () => {
      component.passwrd.setValue({
        password: '',
        passwordConfirm: '',
      });

      expect(component.passwrd.valid).toBeFalse();
    });

    it('password and passwordConfirm should be matched to submit', () => {
      component.passwrd.setValue({
        password: '123456789',
        passwordConfirm: '123456789',
      });

      expect(component.passwrd.valid).toBeTrue();
    });
  });

  describe('Change Password Testing', () => {
    it('onSubmit() should redirect if success', fakeAsync(() => {
      component.passwrd.setValue({
        password: '123456789',
        passwordConfirm: '123456789',
      });

      spyOn(authService, 'resetPassword').and.returnValue(of(true));
      spyOn(component, 'goToLogin').and.callThrough();
      spyOn(component.router, 'navigate').and.returnValue(
        Promise.resolve(true)
      );

      component.onSubmit();
      expect(component.submitting).toBeFalse();
      expect(component.router.navigate).toHaveBeenCalledOnceWith(['/login']);
      flush();
    }));
  });
});
