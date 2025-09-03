import { HomeworkCategory } from './HomeworkCategory.model'
import { HomeworkDbSingleChoiseContent } from './HomeworkDb.model'

export interface UpdateHomeworkDb {
  name: string
  image: string
  category: HomeworkCategory
  content: HomeworkDbSingleChoiseContent
}
