import { FormControl, FormGroup, Validators } from '@angular/forms'
import { HomeworkGroupForm } from '~/homeworks/models/HomeworkGroupForm.model'
import { HomeworkGroupFormData } from '../models/HomeworkGroupFormData.model'

export const homeworkGroupForm = (
  defaultValues?: HomeworkGroupFormData
): FormGroup<HomeworkGroupForm> => {
  return new FormGroup<HomeworkGroupForm>({
    name: new FormControl(defaultValues?.name ?? '', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]
    })
  })
}
