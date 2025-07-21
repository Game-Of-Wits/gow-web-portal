import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms'
import { DiscoveryInformation } from '../models/DiscoveryInformation.model'

export class RevealActionValidator {
  static minimumOneDiscoveryInformationActive(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const activeInformations = (
        control as FormGroup<Record<DiscoveryInformation, FormControl<boolean>>>
      ).getRawValue()

      let atLeastsOneIsActive = false

      for (const [_, value] of Object.entries(activeInformations))
        if (value) atLeastsOneIsActive = true

      return atLeastsOneIsActive
        ? null
        : { minimumOneDiscoveryInformationActive: true }
    }
  }
}
