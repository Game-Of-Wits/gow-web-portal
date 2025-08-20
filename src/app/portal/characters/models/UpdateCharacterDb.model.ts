import { DocumentReference } from '@angular/fire/firestore'

export interface UpdateCharacterDb {
  name: string
  team: DocumentReference
  classroom: DocumentReference
  abilities: DocumentReference[]
}
