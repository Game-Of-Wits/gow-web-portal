import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms'
import { LevelForm } from '../models/LevelForm.model'

export class MasteryRoadLevelsFormValidator {
  static noEqualPrimaryColors(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const initialLevel = (
        control.get('initialLevel') as FormGroup<LevelForm>
      ).getRawValue()
      const levelList = (
        control.get('list') as FormArray<FormGroup<LevelForm>>
      ).getRawValue()

      const primaryColors = new Set<string>()

      primaryColors.add(initialLevel.primaryColor)

      for (const level of levelList) {
        if (primaryColors.has(level.primaryColor)) {
          return { noEqualPrimaryColors: true }
        }

        primaryColors.add(level.primaryColor)
      }

      return null
    }
  }

  static noEqualNames(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const initialLevel = (
        control.get('initialLevel') as FormGroup<LevelForm>
      ).getRawValue()
      const levelList = (
        control.get('list') as FormArray<FormGroup<LevelForm>>
      ).getRawValue()

      const names = new Set<string>()

      names.add(initialLevel.name.trim())

      for (const level of levelList) {
        if (names.has(level.name.trim())) {
          return { noEqualNames: true }
        }

        names.add(level.name.trim())
      }

      return null
    }
  }
}
