import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AddTheftActionForm } from '~/abilities/models/AbilityForm.model'
import { AbilityTheftTarget } from '~/abilities/models/AbilityTheftTarget.model'
import { TheftActionFormData } from '../models/AbilityFormData.model'

export const theftActionForm = (
  defaultValues?: TheftActionFormData
): FormGroup<AddTheftActionForm> => {
  return new FormGroup<AddTheftActionForm>({
    type: new FormControl(AbilityActionType.THEFT, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    target: new FormControl(defaultValues?.target ?? AbilityTheftTarget.ENEMY, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    numberOfAbilities: new FormControl(defaultValues?.numberOfAbilities ?? 1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(25)]
    })
  })
}
