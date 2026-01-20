import { DocumentReference, Timestamp } from '@angular/fire/firestore'

export interface StudentAbilityUsageDbModel {
  id: string
  characterName: string
  experienceSession: DocumentReference
  studentAbility: DocumentReference
  ability: DocumentReference
  abilityName: String
  studentFullName: string
  usageAt: Timestamp
}
