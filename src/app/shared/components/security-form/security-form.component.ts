import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { SharedFormOutput } from 'src/app/models/form.interface';
import {
  ComparePassword,
  ValidateNumberInclusion,
  ValidateSpecialInclusion,
  ValidateUpperLowerCase,
} from 'src/app/validators/password.validator';
import { PASSWORD_ERROR } from './security-form.configs';

interface PasswordVisible {
  password: boolean;
  passwordConfirm: boolean;
}

@Component({
  selector: 'app-security-form',
  templateUrl: './security-form.component.html',
  styleUrls: ['./security-form.component.scss'],
})
export class SecurityFormComponent implements OnInit {
  @Output() onFormChange: EventEmitter<SharedFormOutput> = new EventEmitter();

  securityForm: FormGroup;

  passwordFocus: boolean = false;
  passwordErrorList = PASSWORD_ERROR;
  visible: PasswordVisible = {
    password: false,
    passwordConfirm: false,
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this._createSecurityForm();

    this.securityForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this._emitValues();
    });
  }

  private _createSecurityForm() {
    this.securityForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            ValidateNumberInclusion,
            ValidateSpecialInclusion,
            ValidateUpperLowerCase,
          ],
        ],
        passwordConfirm: ['', [Validators.required]],
      },
      {
        validator: ComparePassword('password', 'passwordConfirm'),
      }
    );
  }

  get form() {
    return this.securityForm.controls;
  }

  private _emitValues() {
    const { touched, dirty, valid } = this.securityForm;
    let data = this.securityForm.getRawValue();

    this.onFormChange.emit({
      touched,
      dirty,
      valid,
      data,
    });
  }
}
