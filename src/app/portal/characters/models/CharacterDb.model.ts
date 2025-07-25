import { DocumentReference } from '@angular/fire/firestore'

export interface CharacterDbModel {
  id: string
  name: string
  team: DocumentReference
  classroom: DocumentReference
  abilities: DocumentReference[]
}
