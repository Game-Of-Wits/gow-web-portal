import { FormControl, FormGroup, Validators } from '@angular/forms'
import { FullCharacterForm } from '../models/FullCharacterForm.model'
import { FullCharacterFormData } from '../models/FullCharacterFormData.model'

export const fullCharacterForm = (
  limitAbilities: number,
  defaultValues?: Partial<FullCharacterFormData>
): FormGroup<FullCharacterForm> => {
  return new FormGroup({
    name: new FormControl(defaultValues?.name ?? '', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]
    }),
    team: new FormControl(defaultValues?.team ?? '', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    abilities: new FormControl<string[]>(
      [...(defaultValues?.abilities ?? [])],
      {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(limitAbilities)]
      }
    )
  })
}
