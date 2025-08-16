import { FormControl, FormGroup, Validators } from '@angular/forms'
import { FieldValidator } from '~/shared/validators/FieldValidator'
import { LevelForm } from '../models/LevelForm.model'
import { LevelFormData } from '../models/LevelFormData.model'
import { LevelRequiredPointsValidator } from '../validators/LevelRequiredPointsValidator'

interface LevelFormDefaultValues extends LevelFormData {
  max: number | null
}

export const levelForm = (
  defaultValues?: Partial<LevelFormDefaultValues>
): FormGroup<LevelForm> => {
  const minimum = defaultValues?.requiredPoints ?? 1
  const maximum = defaultValues?.max ?? null

  return new FormGroup<LevelForm>({
    requiredPoints: new FormControl(
      {
        value: minimum,
        disabled: defaultValues?.requiredPoints === 0
      },
      {
        nonNullable: true,
        validators: [
          Validators.required,
          FieldValidator.isNaN(),
          LevelRequiredPointsValidator.outOfPointLimit({
            min: minimum,
            max: maximum
          })
        ]
      }
    ),
    name: new FormControl(defaultValues?.name ?? '', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(45)
      ]
    }),
    primaryColor: new FormControl(defaultValues?.primaryColor ?? '#ffffff', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(7)
      ]
    })
  })
}
