import { FormControl, FormGroup, Validators } from '@angular/forms'
import { FieldValidator } from '~/shared/validators/FieldValidator'
import { PenaltyForm } from '../models/PenaltyForm.model'

export const penaltyForm = (defaultValues?: {
  name: string
  reducePoints: number
}): FormGroup<PenaltyForm> => {
  return new FormGroup<PenaltyForm>({
    name: new FormControl(defaultValues?.name ?? '', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]
    }),
    reducePoints: new FormControl(defaultValues?.reducePoints ?? 1, {
      nonNullable: true,
      validators: [
        Validators.required,
        FieldValidator.isNaN(),
        Validators.min(1)
      ]
    })
  })
}
