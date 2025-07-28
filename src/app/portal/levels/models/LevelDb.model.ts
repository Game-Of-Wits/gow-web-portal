import { DocumentReference } from '@angular/fire/firestore'

export interface LevelDbModel {
  id: string
  name: string
  requiredPoints: number
  primaryColor: string
  classroom: DocumentReference
  abilities: DocumentReference[]
}
