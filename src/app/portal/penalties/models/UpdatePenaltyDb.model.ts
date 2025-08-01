import { DocumentReference } from '@angular/fire/firestore'

export interface UpdatePenaltyDb {
  name: string
  reducePoints: number
  classroom: DocumentReference
}
