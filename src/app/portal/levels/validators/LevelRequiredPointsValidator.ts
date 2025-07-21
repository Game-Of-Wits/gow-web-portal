import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export class LevelRequiredPointsValidator {
  static outOfPointLimit(limit: {
    min: number
    max: number | null
  }): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const requiredPoints = control.value

      if (requiredPoints < 0)
        return { outOfPointLimit: { min: 0, max: limit.max } }

      if (
        requiredPoints < limit.min ||
        (limit.max !== null && requiredPoints > limit.max)
      )
        return { outOfPointLimit: { min: limit.min, max: limit.max } }

      return null
    }
  }
}
