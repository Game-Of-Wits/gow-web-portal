import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AddReviveActionForm } from '~/abilities/models/AbilityForm.model'
import { ReviveActionFormData } from '../models/AbilityFormData.model'
import { FieldValidator } from '~/shared/validators/FieldValidator'
import { AbilityReviveTarget } from '../models/AbilityReviveTarget.model'

export const reviveActionForm = (
  defaultValues?: ReviveActionFormData
): FormGroup<AddReviveActionForm> => {
  const targetInitial = defaultValues?.target ?? AbilityReviveTarget.CLASSMATE

  const maxTargetsInitial =
    targetInitial === AbilityReviveTarget.YOURSELF
      ? 1
      : (defaultValues?.maxTargets ?? 1)

  const form = new FormGroup<AddReviveActionForm>({
    type: new FormControl(AbilityActionType.REVIVE, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    target: new FormControl(targetInitial, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    maxTargets: new FormControl(maxTargetsInitial, {
      nonNullable: true,
      validators: [
        Validators.required,
        FieldValidator.isNaN(),
        Validators.min(1),
        Validators.max(10)
      ]
    })
  })

  form.controls.target.valueChanges.subscribe(target => {
    const maxTargetsCtrl = form.controls.maxTargets

    if (target === AbilityReviveTarget.YOURSELF) {
      if (maxTargetsCtrl.value !== 1) {
        maxTargetsCtrl.setValue(1, { emitEvent: false })
      }

      maxTargetsCtrl.disable({ emitEvent: false })
    } else {
      if (maxTargetsCtrl.disabled) {
        maxTargetsCtrl.enable({ emitEvent: false })
      }
    }
  })

  return form
}
