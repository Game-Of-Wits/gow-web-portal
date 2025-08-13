import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AddReviveActionForm } from '~/abilities/models/AbilityForm.model'
import { AbilityTarget } from '~/abilities/models/AbilityTarget.model'
import { ReviveActionFormData } from '../models/AbilityFormData.model'

export const reviveActionForm = (
  defaultValues?: ReviveActionFormData
): FormGroup<AddReviveActionForm> => {
  return new FormGroup<AddReviveActionForm>({
    type: new FormControl(AbilityActionType.REVIVE, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    target: new FormControl(defaultValues?.target ?? AbilityTarget.CLASSMATE, {
      nonNullable: true,
      validators: [Validators.required]
    })
  })
}
