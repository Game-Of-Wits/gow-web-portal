import type { DocumentReference, Timestamp } from '@angular/fire/firestore'

export interface AcademicPeriodDbModel {
  id: string
  name: string
  classSessions: DocumentReference[]
  endedAt: Timestamp | null
  startedAt: Timestamp
  school: DocumentReference
}
