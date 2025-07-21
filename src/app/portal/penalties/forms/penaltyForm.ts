import { FormControl, FormGroup, Validators } from '@angular/forms'
import { PenaltyForm } from '../models/PenaltyForm.model'

export const penaltyForm = (): FormGroup<PenaltyForm> => {
  return new FormGroup<PenaltyForm>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]
    }),
    reducePoints: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)]
    })
  })
}
