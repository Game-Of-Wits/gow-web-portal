import { DocumentReference, Timestamp } from '@angular/fire/firestore'

export interface StudentHomeworkDb {
  id: string
  studentState: DocumentReference
  homework: DocumentReference
  deadline: Timestamp
  deliveredAt: Timestamp
  answer: DocumentReference | null
  rewardAbility: DocumentReference
  status: string
}
