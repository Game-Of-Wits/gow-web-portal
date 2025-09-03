import { HomeworkCategory } from './HomeworkCategory.model'
import { UpdateAnswerOption } from './UpdateAnswerOption.model'

export interface UpdateHomework {
  name: string
  image: File | null
  category: HomeworkCategory
  content: UpdateHomeworkContent
}

export type UpdateHomeworkContent = UpdateHomeworkSingleChoiseContent

export interface UpdateHomeworkSingleChoiseContent {
  correctOption: string
  options: UpdateAnswerOption[]
}
