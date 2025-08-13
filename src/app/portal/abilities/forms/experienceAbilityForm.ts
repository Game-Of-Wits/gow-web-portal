import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
import { AbilityClassShift } from '~/abilities/models/AbilityClassShift.model'
import {
  AbilityActionForm,
  AbilityForm
} from '~/abilities/models/AbilityForm.model'
import { AbilityType } from '~/abilities/models/AbilityType.model'
import { AbilityUsage } from '~/abilities/models/AbilityUsage.model'
import { AbilityUsageInterval } from '~/abilities/models/AbilityUsageInterval.model'
import { EducationalExperience } from '~/shared/models/EducationalExperience'

export const experienceAbilityForm = (
  defaultExperience: EducationalExperience,
  defaultUsageType: AbilityUsage
): FormGroup<AbilityForm> => {
  return new FormGroup<AbilityForm>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(60)
      ]
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(300)
      ]
    }),
    isInitial: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    actions: new FormArray<AbilityActionForm>([], {
      validators: [Validators.required, Validators.minLength(1)]
    }),
    experience: new FormControl<EducationalExperience>(defaultExperience, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    type: new FormControl(AbilityType.BENEFIT, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    usage: new FormGroup({
      type: new FormControl<AbilityUsage>(defaultUsageType, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      interval: new FormControl<AbilityUsageInterval>(
        AbilityUsageInterval.SCHOOL_DAY,
        { nonNullable: true, validators: [Validators.required] }
      ),
      shift: new FormControl<AbilityClassShift>(AbilityClassShift.ALL, {
        nonNullable: true,
        validators: [Validators.required]
      })
    })
  })
}
