import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AddAscensionActionForm } from '~/abilities/models/AbilityForm.model'
import { AbilityLevelScope } from '~/abilities/models/AbilityLevelScope.model'

export const ascensionActionForm = (): FormGroup<AddAscensionActionForm> => {
  return new FormGroup<AddAscensionActionForm>({
    type: new FormControl(AbilityActionType.ASCENSION, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    given: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.max(3), Validators.min(1)]
    }),
    taken: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.max(3), Validators.min(1)]
    }),
    takenLevelScope: new FormControl(AbilityLevelScope.ALL_NEXT_LEVELS, {
      nonNullable: true,
      validators: [Validators.required]
    })
  })
}
