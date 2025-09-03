import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export class FieldValidator {
  static isNaN(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return isNaN(control.value) ? { isNaN: true } : null
    }
  }

  static isPhoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const raw = control.getRawValue() as string
      if (raw === null || raw === undefined || String(raw).trim() === '')
        return null

      const value = String(raw).trim()
      const isValid = /^9\d{8}$/.test(value)

      return isValid ? null : { phoneNumber: true }
    }
  }

  static isFutureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.getRawValue()) return null

      const inputDate = new Date(control.getRawValue())
      const today = new Date()

      inputDate.setSeconds(0, 0)
      today.setSeconds(0, 0)

      return inputDate > today ? null : { isFutureDate: true }
    }
  }
}
