import { DocumentReference } from '@angular/fire/firestore'

export interface AnswerOptionDb {
  id: string
  answer: string
  homework: DocumentReference
}
