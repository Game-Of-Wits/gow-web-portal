import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AddHealthActionForm } from '~/abilities/models/AbilityForm.model'
import { AbilityModifier } from '~/abilities/models/AbilityModifier.model'
import { FieldValidator } from '~/shared/validators/FieldValidator'
import { HealthActionFormData } from '../models/AbilityFormData.model'
import { AbilityHealthTarget } from '../models/AbilityHealthTarget.model'

export const healthActionForm = (
  defaultValues?: HealthActionFormData
): FormGroup<AddHealthActionForm> => {
  const targetInitial = defaultValues?.target ?? AbilityHealthTarget.CLASSMATE

  const maxTargetsInitial =
    targetInitial === AbilityHealthTarget.YOURSELF
      ? 1
      : (defaultValues?.maxTargets ?? 1)

  const form = new FormGroup<AddHealthActionForm>({
    type: new FormControl(AbilityActionType.HEALTH, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    modifier: new FormControl(
      defaultValues?.modifier ?? AbilityModifier.INCREMENT,
      {
        nonNullable: true,
        validators: [Validators.required]
      }
    ),
    healthPoints: new FormControl(defaultValues?.healthPoints ?? 1, {
      nonNullable: true,
      validators: [
        Validators.required,
        FieldValidator.isNaN(),
        Validators.min(1),
        Validators.max(1000)
      ]
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

    if (target === AbilityHealthTarget.YOURSELF) {
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
