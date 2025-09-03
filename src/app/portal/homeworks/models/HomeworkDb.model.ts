import { DocumentReference } from '@angular/fire/firestore'
import { HomeworkCategory } from './HomeworkCategory.model'

export interface HomeworkDbModel {
  id: string
  name: string
  image: string
  category: HomeworkCategory
  group: DocumentReference
  content: HomeworkDbContent
}

export type HomeworkDbContent = HomeworkDbSingleChoiseContent

export interface HomeworkDbSingleChoiseContent {
  correctOption: DocumentReference
  options: DocumentReference[]
}
