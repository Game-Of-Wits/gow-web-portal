import { HomeworkCategory } from './HomeworkCategory.model'
import { UpdateHomeworkContent } from './UpdateHomework.model'

export interface UpdateHomeworkParams {
  name: string
  image: string | null
  category: HomeworkCategory
  content: UpdateHomeworkContent
}
