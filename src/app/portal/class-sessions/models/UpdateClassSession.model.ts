import { DocumentReference, FieldValue } from '@angular/fire/firestore'

export interface UpdateClassSessionDb {
  startedAt: FieldValue
  endedAt: FieldValue | null
  classroom: DocumentReference
  experienceSessions: DocumentReference[]
  academicPeriod: DocumentReference
}
