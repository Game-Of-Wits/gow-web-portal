import { AbilityUsageStatus } from './AbilityUsageStatus.model'

export interface StudentAbilityModel {
  id: string
  usageStatus: AbilityUsageStatus
  studentStateId: string
  abilityId: string
  uses: AbilityUsedReference[]
}

export interface AbilityUsedReference {
  usagedId: string
  experienceSessionId: string
}
