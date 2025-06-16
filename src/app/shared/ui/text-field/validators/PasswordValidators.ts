import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export class PasswordValidators {
  static hasCapitalLetter(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value || ''
      const isValid = /[A-Z]/.test(value)
      return isValid ? null : { hasCapitalLetter: { value: control.value } }
    }
  }
  static hasLowercase(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value || ''
      const isValid = /[a-z]/.test(value)
      return isValid ? null : { hasLowercase: { value: control.value } }
    }
  }
  static hasSpecialSymbols(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value || ''
      const isValid = /[!@#\$%\^&\*\(\)_\+=\-\[\]\{\};:'",.<>\/\\|]/.test(value)
      return isValid ? null : { hasSpecialSymbols: { value: control.value } }
    }
  }
  static hasNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value || ''
      const isValid = /[0-9]/.test(value)
      return isValid ? null : { hasNumber: { value: control.value } }
    }
  }
}
