import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export class FieldValidator {
  static isNaN(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return isNaN(control.value) ? { isNaN: true } : null
    }
  }
}
