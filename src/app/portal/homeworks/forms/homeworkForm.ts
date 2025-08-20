import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
import { AnswerOptionForm } from '../models/AnswerOptionForm.model'
import { HomeworkCategory } from '../models/HomeworkCategory.model'
import {
  HomeworkForm,
  HomeworkSingleChoiseContentForm
} from '../models/HomeworkForm.model'
import { HomeworkFormData } from '../models/HomeworkFormData.model'
import { HomeworkValidator } from '../validators/HomeworkValidator'
import { answerOptionForm } from './answerOptionForm'

export const homeworkForm = (
  defaultValues?: HomeworkFormData
): FormGroup<HomeworkForm> => {
  let defaultSingleChoiseOptions: FormGroup<AnswerOptionForm>[] = []

  if (defaultValues) {
    defaultSingleChoiseOptions = defaultValues.content.options.map(option => {
      return answerOptionForm(option)
    })
  }

  return new FormGroup<HomeworkForm>({
    name: new FormControl(defaultValues?.name ?? '', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]
    }),
    image: new FormControl(defaultValues?.image ?? null, {
      validators: [Validators.required]
    }),
    category: new FormControl(HomeworkCategory.SINGLE_CHOISE, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    content: new FormGroup<HomeworkSingleChoiseContentForm>({
      correctOption: new FormControl(
        defaultValues?.content.correctOption ?? '',
        {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(1)]
        }
      ),
      options: new FormArray<FormGroup<AnswerOptionForm>>(
        defaultSingleChoiseOptions,
        {
          validators: [
            Validators.required,
            Validators.minLength(2),
            HomeworkValidator.duplicateAnswers()
          ]
        }
      )
    })
  })
}
