import { DocumentReference, Timestamp } from '@angular/fire/firestore'

export interface EliminatedStudentDbModel {
  id: string
  character: DocumentReference
  classroom: DocumentReference
  eliminatedAt: Timestamp
  motivation: any
  studentState: DocumentReference
  team: DocumentReference
}
