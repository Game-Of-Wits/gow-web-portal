import { CreateAnswerOption } from './CreateAnswerOption.model'
import { HomeworkCategory } from './HomeworkCategory.model'

export interface CreateHomework {
  image: File
  name: string
  category: HomeworkCategory
  groupId: string
  content: CreateHomeworkContent
}

export type CreateHomeworkContent = CreateHomeworkSingleChoiseContent

export interface CreateHomeworkSingleChoiseContent {
  correctOption: string
  options: CreateAnswerOption[]
}
