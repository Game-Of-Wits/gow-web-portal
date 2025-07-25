import { DocumentReference, Timestamp } from '@angular/fire/firestore'

export interface HomeworkAnswerDbModel {
  id: string
  studentState: DocumentReference
  homework: DocumentReference
  respondedAt: Timestamp
  content: HomeworkAnswerDbContent
}

export type HomeworkAnswerDbContent = HomeworkAnswerDbSingleChoiseContent

export interface HomeworkAnswerDbSingleChoiseContent {
  optionSelected: DocumentReference
}
