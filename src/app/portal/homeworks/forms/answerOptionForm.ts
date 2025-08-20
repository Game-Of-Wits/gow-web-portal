import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AnswerOptionForm } from '../models/AnswerOptionForm.model'
import { AnswerOptionFormData } from '../models/AnswerOptionFormData.model'

export const answerOptionForm = (
  defaultValues?: AnswerOptionFormData
): FormGroup<AnswerOptionForm> => {
  return new FormGroup<AnswerOptionForm>({
    id: new FormControl(defaultValues?.id ?? null),
    answer: new FormControl(defaultValues?.answer ?? '', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]
    })
  })
}
