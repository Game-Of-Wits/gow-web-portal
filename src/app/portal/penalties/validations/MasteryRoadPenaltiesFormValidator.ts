import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms'
import { PenaltyForm } from '../models/PenaltyForm.model'

export class MasteryRoadPenaltiesFormValidator {
  static noEqualNames(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const penaltyList = (
        control as FormArray<FormGroup<PenaltyForm>>
      ).getRawValue()

      const names = new Set<string>()

      for (const penalty of penaltyList) {
        if (names.has(penalty.name.trim())) {
          return { noEqualNames: true }
        }

        names.add(penalty.name.trim())
      }

      return null
    }
  }
}
