import { AbilityUsageStatus } from './AbilityUsageStatus.model'

export interface StudentAbilityModel {
  id: string
  usageStatus: AbilityUsageStatus
  studentStateId: string
  abilityId: string
  isDeleted: boolean
  usesIds: string[]
}
