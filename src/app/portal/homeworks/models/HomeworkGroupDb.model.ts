import { DocumentReference, Timestamp } from '@angular/fire/firestore'

export interface HomeworkGroupDbModel {
  id: string
  name: string
  classroom: DocumentReference
  homeworks: DocumentReference[]
  createdAt: Timestamp
  deliveredAt: Timestamp | null
  baseDateLimit: Timestamp | null
}
