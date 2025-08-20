import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms'

export class HomeworkValidator {
  static duplicateAnswers(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!(control instanceof FormArray)) return null

      const answers = control.controls
        .map(c => (c as FormGroup).get('answer')?.value?.trim())
        .filter(v => !!v)

      const hasDuplicates = answers.some(
        (value, index) => answers.indexOf(value) !== index
      )

      return hasDuplicates ? { duplicateAnswers: true } : null
    }
  }
}
