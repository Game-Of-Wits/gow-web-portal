import { DocumentReference } from '@angular/fire/firestore'

export interface LevelRewardDbModel {
  id: string
  achievedLevel: DocumentReference
  studentState: DocumentReference
  claimed: boolean
}
