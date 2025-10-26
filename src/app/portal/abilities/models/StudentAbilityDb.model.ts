import { DocumentReference } from '@angular/fire/firestore'
import { AbilityUsageStatus } from './AbilityUsageStatus.model'

export interface StudentAbilityDb {
  id: string
  usageStatus: AbilityUsageStatus
  studentState: DocumentReference
  ability: DocumentReference
  isDeleted: boolean
  uses: DocumentReference[]
}
