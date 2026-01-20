import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AddProtectionActionForm } from '~/abilities/models/AbilityForm.model'
import { FieldValidator } from '~/shared/validators/FieldValidator'
import { ProtectionActionFormData } from '../models/AbilityFormData.model'
import { AbilityProtectionTarget } from '../models/AbilityProtectionTarget.model'

export const protectionActionForm = (
  defaultValues?: ProtectionActionFormData
): FormGroup<AddProtectionActionForm> => {
  const targetInitial =
    defaultValues?.target ?? AbilityProtectionTarget.CLASSMATE

  const maxTargetsInitial =
    targetInitial === AbilityProtectionTarget.YOURSELF
      ? 1
      : (defaultValues?.maxTargets ?? 1)

  const form = new FormGroup<AddProtectionActionForm>({
    type: new FormControl(AbilityActionType.PROTECTION, {
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

    if (target === AbilityProtectionTarget.YOURSELF) {
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
