import { FormControl, FormGroup, Validators } from '@angular/forms'
import { PasswordValidators } from '~/shared/components/ui/text-field/validators/PasswordValidators'
import { FieldValidator } from '~/shared/validators/FieldValidator'
import { CreateStudentForm } from '../models/CreateStudentForm.model'

export const createStudentForm = (): FormGroup<CreateStudentForm> => {
  return new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]
    }),
    phoneNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, FieldValidator.isPhoneNumber()]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(12),
        PasswordValidators.hasLowercase(),
        PasswordValidators.hasCapitalLetter(),
        PasswordValidators.hasSpecialSymbols(),
        PasswordValidators.hasNumber()
      ]
    }),
    character: new FormControl<string | null>(null, {
      validators: [Validators.required]
    })
  })
}
