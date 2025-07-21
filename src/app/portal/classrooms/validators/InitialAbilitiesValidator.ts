import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms'
import { AbilityForm } from '~/abilities/models/AbilityForm.model'

export class InitialAbilitiesValidator {
  static noEqualNames(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const initialAbilityNames = (control as FormArray<FormGroup<AbilityForm>>)
        .getRawValue()
        .map(ability => ability.name)

      const abilityNames = new Set<string>()

      for (const abilityName of initialAbilityNames) {
        if (abilityNames.has(abilityName)) return { noEqualNames: true }
        abilityNames.add(abilityName)
      }

      return null
    }
  }
}
