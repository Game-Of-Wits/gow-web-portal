import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AddAscensionActionForm } from '~/abilities/models/AbilityForm.model'
import { AbilityLevelScope } from '~/abilities/models/AbilityLevelScope.model'
import { FieldValidator } from '~/shared/validators/FieldValidator'
import { AscensionActionFormData } from '../models/AbilityFormData.model'

export const ascensionActionForm = (
  defaultValues?: AscensionActionFormData
): FormGroup<AddAscensionActionForm> => {
  return new FormGroup<AddAscensionActionForm>({
    type: new FormControl(AbilityActionType.ASCENSION, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    given: new FormControl(defaultValues?.given ?? 1, {
      nonNullable: true,
      validators: [
        Validators.required,
        FieldValidator.isNaN(),
        Validators.max(3),
        Validators.min(1)
      ]
    }),
    taken: new FormControl(defaultValues?.taken ?? 1, {
      nonNullable: true,
      validators: [
        Validators.required,
        FieldValidator.isNaN(),
        Validators.max(3),
        Validators.min(1)
      ]
    }),
    takenLevelScope: new FormControl(
      defaultValues?.takenLevelScope ?? AbilityLevelScope.ALL_NEXT_LEVELS,
      {
        nonNullable: true,
        validators: [Validators.required]
      }
    )
  })
}
