import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { AbilityActionType } from './AbilityActionType.model'
import { AbilityClassShift } from './AbilityClassShift.model'
import { AbilityHealthTarget } from './AbilityHealthTarget.model'
import { AbilityLevelScope } from './AbilityLevelScope.model'
import { AbilityModifier } from './AbilityModifier.model'
import { AbilityProtectionTarget } from './AbilityProtectionTarget.model'
import { AbilityTarget } from './AbilityTarget.model'
import { AbilityTheftTarget } from './AbilityTheftTarget.model'
import { AbilityType } from './AbilityType.model'
import { AbilityUnitTime } from './AbilityUnitTime.model'
import { AbilityUsage } from './AbilityUsage.model'
import { AbilityUsageInterval } from './AbilityUsageInterval.model'
import { DiscoveryInformation } from './DiscoveryInformation.model'
import { AbilityReviveTarget } from './AbilityReviveTarget.model'
import { AbilityRevealTarget } from './AbilityRevealTarget.model'
import { AbilityInvulnerabilityTarget } from './AbilityInvulnerabilityTarget.model'
import { AbilityRevengeTarget } from './AbilityRevengeTarget.model'
import { AbilityMirrorTarget } from './AbilityMirrorTarget.model'

export interface AbilityFormData {
  name: string
  description: string
  type: AbilityType
  usage: {
    type: AbilityUsage
    shift?: AbilityClassShift
    interval?: AbilityUsageInterval
  }
  actions: AbilityActionFormData[]
  experience: EducationalExperience
  isInitial: boolean
}

export type AbilityActionFormData =
  | ClassroomActionFormData
  | AscensionActionFormData
  | TheftActionFormData
  | HealthActionFormData
  | ReviveActionFormData
  | RevealActionFormData
  | DeferealHomeworkActionFormData
  | ProtectionActionFormData
  | MirrorActionFormData
  | InvulnerabilityActionFormData
  | RevengeActionFormData

export interface ClassroomActionFormData {
  type: AbilityActionType.CLASSROOM
}

export interface AscensionActionFormData {
  type: AbilityActionType.ASCENSION
  taken: number
  given: number
  takenLevelScope: AbilityLevelScope
}

export interface TheftActionFormData {
  type: AbilityActionType.THEFT
  numberOfAbilities: number
  target: AbilityTheftTarget
}

export interface HealthActionFormData {
  type: AbilityActionType.HEALTH
  modifier: AbilityModifier
  healthPoints: number
  target: AbilityHealthTarget
  maxTargets: number
}

export interface ReviveActionFormData {
  type: AbilityActionType.REVIVE
  target: AbilityReviveTarget
  maxTargets: number
}

export interface RevealActionFormData {
  type: AbilityActionType.REVEAL
  information: Record<DiscoveryInformation, boolean>
  target: AbilityRevealTarget
  maxTargets: number
}

export interface DeferealHomeworkActionFormData {
  type: AbilityActionType.DEFEREAL_HOMEWORK
  unitTime: AbilityUnitTime
  time: number
}

export interface ProtectionActionFormData {
  type: AbilityActionType.PROTECTION
  target: AbilityProtectionTarget
  maxTargets: number
}

export interface InvulnerabilityActionFormData {
  type: AbilityActionType.INVULNERABILITY
  target: AbilityInvulnerabilityTarget
  maxTargets: number
}

export interface RevengeActionFormData {
  type: AbilityActionType.REVENGE
  target: AbilityRevengeTarget
  maxTargets: number
}

export interface MirrorActionFormData {
  type: AbilityActionType.MIRROR
  target: AbilityMirrorTarget
  maxTargets: number
}
