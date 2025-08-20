import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export class FieldValidator {
  static isNaN(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return isNaN(control.value) ? { isNaN: true } : null
    }
  }

  static isPhoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const raw = control.value
      if (raw === null || raw === undefined || String(raw).trim() === '')
        return null

      const value = String(raw).trim()
      const isValid = /^\d{9}$/.test(value)

      return isValid ? null : { phoneNumber: true }
    }
  }
}
