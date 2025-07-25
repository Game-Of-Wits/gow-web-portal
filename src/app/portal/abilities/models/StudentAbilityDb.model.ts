import { DocumentReference } from '@angular/fire/firestore'
import { AbilityUsageStatus } from './AbilityUsageStatus.model'

export interface StudentAbilityDb {
  id: string
  usageStatus: AbilityUsageStatus
  studentState: DocumentReference
  ability: DocumentReference
  uses: AbilityUsedReferenceDb[]
}

export interface AbilityUsedReferenceDb {
  usagedId: string
  experienceSession: DocumentReference
}
