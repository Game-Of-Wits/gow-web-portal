import { FormControl, FormGroup, Validators } from '@angular/forms'
import { PasswordValidators } from '~/shared/components/ui/text-field/validators/PasswordValidators'
import { SignInForm } from '../models/SignInForm.model'

export const signInForm = (): FormGroup<SignInForm> => {
  return new FormGroup({
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
    })
  })
}
