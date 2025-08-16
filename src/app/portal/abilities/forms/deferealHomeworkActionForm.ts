import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AddDeferealHomeworkActionForm } from '~/abilities/models/AbilityForm.model'
import { AbilityUnitTime } from '~/abilities/models/AbilityUnitTime.model'
import { FieldValidator } from '~/shared/validators/FieldValidator'
import { DeferealHomeworkActionFormData } from '../models/AbilityFormData.model'

export const deferealHomeworkActionForm = (
  defaultValues?: DeferealHomeworkActionFormData
): FormGroup<AddDeferealHomeworkActionForm> => {
  return new FormGroup<AddDeferealHomeworkActionForm>({
    type: new FormControl(AbilityActionType.DEFEREAL_HOMEWORK, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    time: new FormControl(defaultValues?.time ?? 1, {
      nonNullable: true,
      validators: [
        Validators.required,
        FieldValidator.isNaN(),
        Validators.min(1),
        Validators.max(12)
      ]
    }),
    unitTime: new FormControl(
      defaultValues?.unitTime ?? AbilityUnitTime.HOURS,
      {
        nonNullable: true,
        validators: [Validators.required]
      }
    )
  })
}
