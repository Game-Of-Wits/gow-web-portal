import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AddRevealActionForm } from '~/abilities/models/AbilityForm.model'
import { DiscoveryInformation } from '~/abilities/models/DiscoveryInformation.model'
import { RevealActionFormData } from '../models/AbilityFormData.model'
import { RevealActionValidator } from '../validators/RevealActionValidator'
import { FieldValidator } from '~/shared/validators/FieldValidator'
import { AbilityRevealTarget } from '../models/AbilityRevealTarget.model'

export const revealActionForm = (
  defaultValues?: RevealActionFormData
): FormGroup<AddRevealActionForm> => {
  const targetInitial = defaultValues?.target ?? AbilityRevealTarget.CLASSMATE

  const maxTargetsInitial =
    targetInitial === AbilityRevealTarget.YOURSELF
      ? 1
      : (defaultValues?.maxTargets ?? 1)

  const informationValue: Record<DiscoveryInformation, FormControl<boolean>> = {
    [DiscoveryInformation.CHARACTER]: new FormControl(true, {
      nonNullable: true
    }),
    [DiscoveryInformation.TEAM]: new FormControl(true, {
      nonNullable: true
    }),
    [DiscoveryInformation.ABILITIES]: new FormControl(false, {
      nonNullable: true
    })
  }

  if (defaultValues) {
    Object.entries(defaultValues.information).forEach(([info, value]) => {
      informationValue[info as DiscoveryInformation].setValue(value)
    })
  }

  const form = new FormGroup<AddRevealActionForm>({
    type: new FormControl(AbilityActionType.REVEAL, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    information: new FormGroup<
      Record<DiscoveryInformation, FormControl<boolean>>
    >(informationValue, {
      validators: [RevealActionValidator.minimumOneDiscoveryInformationActive()]
    }),
    target: new FormControl<AbilityRevealTarget>(targetInitial, {
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

    if (target === AbilityRevealTarget.YOURSELF) {
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
