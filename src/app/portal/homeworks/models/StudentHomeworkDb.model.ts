import { DocumentReference } from '@angular/fire/firestore'

export interface StudentHomeworkDb {
  studentState: DocumentReference
  homework: DocumentReference
  deadline: Date
  deviveredAt: Date
  answer: DocumentReference | null
  rewardAbility: DocumentReference
  status: string
}
