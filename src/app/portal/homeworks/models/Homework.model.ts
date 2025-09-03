import { HomeworkCategory } from './HomeworkCategory.model'

export interface HomeworkModel {
  id: string
  name: string
  image: string
  category: HomeworkCategory
  groupId: string
  content: HomeworkContent
}

export type HomeworkContent = HomeworkSingleChoiseContent

export interface HomeworkSingleChoiseContent {
  correctOptionId: string
  optionIds: string[]
}
