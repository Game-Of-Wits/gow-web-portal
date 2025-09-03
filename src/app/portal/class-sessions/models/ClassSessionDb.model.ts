import { DocumentReference, Timestamp } from '@angular/fire/firestore'

export interface ClassSessionDbModel {
  id: string
  startedAt: Timestamp
  endedAt: Timestamp | null
  classroom: DocumentReference
  experienceSessions: DocumentReference[]
  academicPeriod: DocumentReference
}
