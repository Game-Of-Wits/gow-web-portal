import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AddMirrorActionForm } from '~/abilities/models/AbilityForm.model'
import { FieldValidator } from '~/shared/validators/FieldValidator'
import { MirrorActionFormData } from '../models/AbilityFormData.model'
import { AbilityMirrorTarget } from '../models/AbilityMirrorTarget.model'

export const mirrorActionForm = (
  defaultValues?: MirrorActionFormData
): FormGroup<AddMirrorActionForm> => {
  const targetInitial =
    defaultValues?.target ?? AbilityMirrorTarget.CLASSMATE

  const maxTargetsInitial =
    targetInitial === AbilityMirrorTarget.YOURSELF
      ? 1
      : (defaultValues?.maxTargets ?? 1)

  const form = new FormGroup<AddMirrorActionForm>({
    type: new FormControl(AbilityActionType.MIRROR, {
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

    if (target === AbilityMirrorTarget.YOURSELF) {
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
