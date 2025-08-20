import { FormControl } from '@angular/forms'

export interface AnswerOptionForm {
  id: FormControl<string | null>
  answer: FormControl<string>
}
