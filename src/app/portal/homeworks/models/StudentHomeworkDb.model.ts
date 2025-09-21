import { DocumentReference } from '@angular/fire/firestore'

export interface StudentHomeworkDb {
  studentState: DocumentReference
  homework: DocumentReference
  deadline: Date
  answer: DocumentReference | null
  status: string
}
