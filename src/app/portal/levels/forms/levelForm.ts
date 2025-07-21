import { FormControl, FormGroup, Validators } from '@angular/forms'
import { LevelForm } from '../models/LevelForm.model'
import { LevelRequiredPointsValidator } from '../validators/LevelRequiredPointsValidator'

export const levelForm = (requiredPointsLimit: {
  min: number | null
  max: number | null
}): FormGroup<LevelForm> => {
  const minimum = requiredPointsLimit.min ?? 1
  const maximum = requiredPointsLimit.max

  return new FormGroup<LevelForm>({
    requiredPoints: new FormControl(minimum, {
      nonNullable: true,
      validators: [
        Validators.required,
        LevelRequiredPointsValidator.outOfPointLimit({
          min: minimum,
          max: maximum
        })
      ]
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(45)
      ]
    }),
    primaryColor: new FormControl('#ffffff', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(7)
      ]
    })
  })
}
