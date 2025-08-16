import { DocumentReference } from '@angular/fire/firestore'

export interface UpdateLevelDb {
  name: string
  requiredPoints: number
  primaryColor: string
  classroom: DocumentReference
  abilities: DocumentReference[]
}
