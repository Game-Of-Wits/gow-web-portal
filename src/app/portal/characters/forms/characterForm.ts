import { FormControl, FormGroup, Validators } from '@angular/forms'
import { CharacterForm } from '../models/CharacterForm.model'

export const characterForm = (): FormGroup<CharacterForm> => {
  return new FormGroup<CharacterForm>({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]
    }),
    teamName: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30)
      ]
    })
  })
}
