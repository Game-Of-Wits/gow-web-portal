import { DocumentReference } from '@angular/fire/firestore'

export interface TeamDbModel {
  id: string
  name: string
  classroom: DocumentReference
  characters: DocumentReference[]
}
