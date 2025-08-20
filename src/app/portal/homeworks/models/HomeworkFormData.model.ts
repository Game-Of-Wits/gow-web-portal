import { AnswerOptionFormData } from './AnswerOptionFormData.model'
import { HomeworkCategory } from './HomeworkCategory.model'

export interface HomeworkFormData {
  name: string
  image: File | null
  category: HomeworkCategory
  content: HomeworkContentFormData
}

export type HomeworkContentFormData = HomeworkSingleChoiseContentFormData

export interface HomeworkSingleChoiseContentFormData {
  correctOption: string
  options: AnswerOptionFormData[]
}
