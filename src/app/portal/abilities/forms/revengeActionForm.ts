import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AddRevengeActionForm } from '~/abilities/models/AbilityForm.model'
import { FieldValidator } from '~/shared/validators/FieldValidator'
import { RevengeActionFormData } from '../models/AbilityFormData.model'
import { AbilityRevengeTarget } from '../models/AbilityRevengeTarget.model'

export const revengeActionForm = (
  defaultValues?: RevengeActionFormData
): FormGroup<AddRevengeActionForm> => {
  const targetInitial =
    defaultValues?.target ?? AbilityRevengeTarget.CLASSMATE

  const maxTargetsInitial =
    targetInitial === AbilityRevengeTarget.YOURSELF
      ? 1
      : (defaultValues?.maxTargets ?? 1)

  const form = new FormGroup<AddRevengeActionForm>({
    type: new FormControl(AbilityActionType.REVENGE, {
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
        Validators.min(1),
        FieldValidator.isNaN()
      ]
    })
  })

  form.controls.target.valueChanges.subscribe(target => {
    const maxTargetsCtrl = form.controls.maxTargets

    if (target === AbilityRevengeTarget.YOURSELF) {
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
