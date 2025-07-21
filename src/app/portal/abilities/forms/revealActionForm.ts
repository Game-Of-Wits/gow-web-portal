import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AddRevealActionForm } from '~/abilities/models/AbilityForm.model'
import { AbilityTarget } from '~/abilities/models/AbilityTarget.model'
import { DiscoveryInformation } from '~/abilities/models/DiscoveryInformation.model'
import { RevealActionValidator } from '../validators/RevealActionValidator'

export const revealActionForm = (): FormGroup<AddRevealActionForm> => {
  return new FormGroup<AddRevealActionForm>({
    type: new FormControl(AbilityActionType.REVEAL, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    information: new FormGroup<
      Record<DiscoveryInformation, FormControl<boolean>>
    >(
      {
        [DiscoveryInformation.CHARACTER]: new FormControl(true, {
          nonNullable: true
        }),
        [DiscoveryInformation.TEAM]: new FormControl(true, {
          nonNullable: true
        }),
        [DiscoveryInformation.ABILITIES]: new FormControl(false, {
          nonNullable: true
        })
      },
      {
        validators: [
          RevealActionValidator.minimumOneDiscoveryInformationActive()
        ]
      }
    ),
    target: new FormControl<AbilityTarget>(AbilityTarget.CLASSMATE, {
      nonNullable: true,
      validators: [Validators.required]
    })
  })
}
