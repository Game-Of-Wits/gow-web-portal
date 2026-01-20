import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { AbilityActionType } from '../models/AbilityActionType.model'
import { AbilityClassShift } from '../models/AbilityClassShift.model'
import { AbilityActionForm, AbilityForm } from '../models/AbilityForm.model'
import { AbilityFormData } from '../models/AbilityFormData.model'
import { AbilityType } from '../models/AbilityType.model'
import { AbilityUsage } from '../models/AbilityUsage.model'
import { AbilityUsageInterval } from '../models/AbilityUsageInterval.model'
import { ascensionActionForm } from './ascensionActionForm'
import { classroomActionForm } from './classroomActionForm'
import { deferealHomeworkActionForm } from './deferealHomeworkActionForm'
import { healthActionForm } from './healthActionForm'
import { revealActionForm } from './revealActionForm'
import { reviveActionForm } from './reviveActionForm'
import { theftActionForm } from './theftActionForm'
import { protectionActionForm } from './protectionActionForm'
import { invulnerabilityActionForm } from './invulnerabilityActionForm'
import { revengeActionForm } from './revengeActionForm'
import { mirrorActionForm } from './mirrorActionForm'

export const fullAbilityForm = (
  defaultValues?: AbilityFormData
): FormGroup<AbilityForm> => {
  const abilityForm = new FormGroup<AbilityForm>({
    name: new FormControl(defaultValues?.name ?? '', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(60)
      ]
    }),
    description: new FormControl(defaultValues?.description ?? '', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(300)
      ]
    }),
    isInitial: new FormControl(defaultValues?.isInitial ?? false, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    actions: new FormArray<AbilityActionForm>([], {
      validators: [Validators.required, Validators.minLength(1)]
    }),
    experience: new FormControl<EducationalExperience>(
      defaultValues?.experience ?? EducationalExperience.MASTERY_ROAD,
      {
        nonNullable: true,
        validators: [Validators.required]
      }
    ),
    type: new FormControl(defaultValues?.type ?? AbilityType.BENEFIT, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    usage: new FormGroup({
      type: new FormControl<AbilityUsage>(
        defaultValues?.usage.type ?? AbilityUsage.ONE_TIME,
        {
          nonNullable: true,
          validators: [Validators.required]
        }
      ),
      interval: new FormControl<AbilityUsageInterval>(
        defaultValues?.usage.interval ?? AbilityUsageInterval.SCHOOL_DAY,
        {
          nonNullable: true,
          validators: [Validators.required]
        }
      ),
      shift: new FormControl<AbilityClassShift>(
        defaultValues?.usage.shift ?? AbilityClassShift.ALL,
        {
          nonNullable: true,
          validators: [Validators.required]
        }
      )
    })
  })

  if (defaultValues) {
    const defaultFormAbilityActions = defaultValues.actions.map(action => {
      if (action.type === AbilityActionType.ASCENSION)
        return ascensionActionForm(action)
      if (action.type === AbilityActionType.THEFT)
        return theftActionForm(action)
      if (action.type === AbilityActionType.REVEAL)
        return revealActionForm(action)
      if (action.type === AbilityActionType.REVIVE)
        return reviveActionForm(action)
      if (action.type === AbilityActionType.HEALTH)
        return healthActionForm(action)
      if (action.type === AbilityActionType.DEFEREAL_HOMEWORK)
        return deferealHomeworkActionForm(action)
      if (action.type === AbilityActionType.PROTECTION)
        return protectionActionForm(action)
      if (action.type === AbilityActionType.INVULNERABILITY)
        return invulnerabilityActionForm(action)
      if (action.type === AbilityActionType.MIRROR)
        return mirrorActionForm(action)
      if (action.type === AbilityActionType.REVENGE)
        return revengeActionForm(action)
      return classroomActionForm()
    })

    const abilityActionsForm = abilityForm.get('actions') as FormArray

    defaultFormAbilityActions.forEach(actionForm =>
      abilityActionsForm.push(actionForm)
    )
  }

  abilityForm.controls.experience.valueChanges.subscribe(experience => {
    const usageCtrls = abilityForm.controls.usage.controls
    const usageForm = abilityForm.controls.usage

    if (experience === EducationalExperience.MASTERY_ROAD) {
      usageCtrls.type.enable()
      usageCtrls.interval.enable()

      usageCtrls.type.setValue(AbilityUsage.ONE_TIME, { emitEvent: false })
      usageCtrls.shift.setValue(AbilityClassShift.ALL, { emitEvent: false })
      usageCtrls.interval.setValue(AbilityUsageInterval.SCHOOL_DAY, {
        emitEvent: false
      })

      usageForm.disable()
    } else if (experience === EducationalExperience.SHADOW_WARFARE) {
      usageForm.enable()

      usageCtrls.interval.setValue(AbilityUsageInterval.SCHOOL_DAY, {
        emitEvent: false
      })

      usageCtrls.interval.disable()
    }
  })

  return abilityForm
}
