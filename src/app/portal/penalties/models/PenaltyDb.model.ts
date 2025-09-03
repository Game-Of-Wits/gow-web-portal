import { DocumentReference } from '@angular/fire/firestore'

export interface PenaltyDbModel {
  id: string
  name: string
  reducePoints: number
  classroom: DocumentReference
}
