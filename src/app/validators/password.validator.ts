import { FormGroup, AbstractControl } from '@angular/forms';

export function ComparePassword(
  controlName: string,
  matchingControlName: string
) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      return;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

export function ValidateNumberInclusion(control: AbstractControl) {
  let pattern = new RegExp('.*[0-9].*');

  if (!pattern.test(control.value)) {
    return { numberInclusion: true };
  }
  return null;
}

export function ValidateSpecialInclusion(control: AbstractControl) {
  let pattern = new RegExp('.*[!@#$%^&*].*');

  if (!pattern.test(control.value)) {
    return { specialInclusion: true };
  }
  return null;
}

export function ValidateUpperLowerCase(control: AbstractControl) {
  let pattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])');

  if (!pattern.test(control.value)) {
    return { upperLowerCase: true };
  }
  return null;
}

export function ValidateEmailPattern(control: AbstractControl) {
  let pattern = new RegExp(
    '/^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/'
  );

  if (!pattern.test(control.value)) {
    return { emailPattern: true };
  }

  return null;
}
