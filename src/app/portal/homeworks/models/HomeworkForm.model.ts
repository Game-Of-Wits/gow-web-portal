import { FormArray, FormControl, FormGroup } from '@angular/forms'
import { AnswerOptionForm } from './AnswerOptionForm.model'
import { HomeworkCategory } from './HomeworkCategory.model'

export interface HomeworkForm {
  name: FormControl<string>
  image: FormControl<File | null>
  category: FormControl<HomeworkCategory>
  content: HomeworkContentForm
}

export type HomeworkContentForm = FormGroup<HomeworkSingleChoiseContentForm>

export interface HomeworkSingleChoiseContentForm {
  correctOption: FormControl<string>
  options: FormArray<FormGroup<AnswerOptionForm>>
}
