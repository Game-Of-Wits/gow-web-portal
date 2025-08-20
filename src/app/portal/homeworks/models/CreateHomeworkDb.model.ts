import { DocumentReference } from '@angular/fire/firestore'
import { HomeworkCategory } from './HomeworkCategory.model'

export interface CreateHomeworkDb {
  image: string
  name: string
  category: HomeworkCategory
  groupId: string
  content: CreateHomeworkContentDb
}

export type CreateHomeworkContentDb = CreateHomeworkSingleChoiseContentDb

export interface CreateHomeworkSingleChoiseContentDb {
  correctOption: DocumentReference
  options: DocumentReference[]
}
