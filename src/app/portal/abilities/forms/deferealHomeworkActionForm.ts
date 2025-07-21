import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AddDeferealHomeworkActionForm } from '~/abilities/models/AbilityForm.model'
import { AbilityUnitTime } from '~/abilities/models/AbilityUnitTime.model'

export const deferealHomeworkActionForm =
  (): FormGroup<AddDeferealHomeworkActionForm> => {
    return new FormGroup<AddDeferealHomeworkActionForm>({
      type: new FormControl(AbilityActionType.DEFEREAL_HOMEWORK, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      time: new FormControl(1, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1), Validators.max(12)]
      }),
      unitTime: new FormControl(AbilityUnitTime.HOURS, {
        nonNullable: true,
        validators: [Validators.required]
      })
    })
  }
