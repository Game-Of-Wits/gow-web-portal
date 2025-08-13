import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AddHealthActionForm } from '~/abilities/models/AbilityForm.model'
import { AbilityModifier } from '~/abilities/models/AbilityModifier.model'
import { HealthActionFormData } from '../models/AbilityFormData.model'

export const healthActionForm = (
  defaultValues?: HealthActionFormData
): FormGroup<AddHealthActionForm> => {
  return new FormGroup<AddHealthActionForm>({
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
      validators: [Validators.required, Validators.min(1), Validators.max(1000)]
    })
  })
}
