import { DocumentReference } from '@angular/fire/firestore'

export interface TeamDbModel {
  id: string
  classroom: DocumentReference
  characters: DocumentReference[]
}
