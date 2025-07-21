import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AddReviveActionForm } from '~/abilities/models/AbilityForm.model'
import { AbilityTarget } from '~/abilities/models/AbilityTarget.model'

export const reviveActionForm = (): FormGroup<AddReviveActionForm> => {
  return new FormGroup<AddReviveActionForm>({
    type: new FormControl(AbilityActionType.REVIVE, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    target: new FormControl(AbilityTarget.CLASSMATE, {
      nonNullable: true,
      validators: [Validators.required]
    })
  })
}
