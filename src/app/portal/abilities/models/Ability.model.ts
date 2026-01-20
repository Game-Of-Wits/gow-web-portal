import { AbilityActionType } from './AbilityActionType.model'
import { AbilityClassShift } from './AbilityClassShift.model'
import { AbilityHealthTarget } from './AbilityHealthTarget.model'
import { AbilityLevelScope } from './AbilityLevelScope.model'
import { AbilityModifier } from './AbilityModifier.model'
import { AbilityProtectionTarget } from './AbilityProtectionTarget.model'
import { AbilityTheftTarget } from './AbilityTheftTarget.model'
import { AbilityType } from './AbilityType.model'
import { AbilityUnitTime } from './AbilityUnitTime.model'
import { AbilityUsage } from './AbilityUsage.model'
import { AbilityRevealTarget } from './AbilityRevealTarget.model'
import { AbilityReviveTarget } from './AbilityReviveTarget.model'
import { AbilityUsageInterval } from './AbilityUsageInterval.model'
import { DiscoveryInformation } from './DiscoveryInformation.model'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { AbilityInvulnerabilityTarget } from './AbilityInvulnerabilityTarget.model'
import { AbilityRevengeTarget } from './AbilityRevengeTarget.model'
import { AbilityMirrorTarget } from './AbilityMirrorTarget.model'

export interface AbilityModel {
  id: string
  name: string
  description: string
  type: AbilityType
  usage: {
    type: AbilityUsage
    shift?: AbilityClassShift
    interval?: AbilityUsageInterval
  }
  actions: AbilityActionModel[]
  experience: EducationalExperience
  isInitial: boolean
}

export type AbilityActionModel =
  | ClassroomActionModel
  | AscensionActionModel
  | TheftActionModel
  | HealthActionModel
  | ReviveActionModel
  | RevealActionModel
  | DeferealHomeworkActionModel
  | ProtectionActionModel
  | MirrorActionModel
  | InvulnerabilityActionModel
  | RevengeActionModel

export interface ClassroomActionModel {
  type: AbilityActionType.CLASSROOM
}

export interface AscensionActionModel {
  type: AbilityActionType.ASCENSION
  taken: number
  given: number
  takenLevelScope: AbilityLevelScope
}

export interface TheftActionModel {
  type: AbilityActionType.THEFT
  numberOfAbilities: number
  target: AbilityTheftTarget
}

export interface HealthActionModel {
  type: AbilityActionType.HEALTH
  modifier: AbilityModifier
  healthPoints: number
  target: AbilityHealthTarget
  maxTargets: number
}

export interface ReviveActionModel {
  type: AbilityActionType.REVIVE
  target: AbilityReviveTarget
  maxTargets: number
}

export interface RevealActionModel {
  type: AbilityActionType.REVEAL
  information: DiscoveryInformation[]
  target: AbilityRevealTarget
  maxTargets: number
}

export interface DeferealHomeworkActionModel {
  type: AbilityActionType.DEFEREAL_HOMEWORK
  unitTime: AbilityUnitTime
  time: number
}

export interface ProtectionActionModel {
  type: AbilityActionType.PROTECTION
  target: AbilityProtectionTarget
  maxTargets: number
}

export interface InvulnerabilityActionModel {
  type: AbilityActionType.INVULNERABILITY
  target: AbilityInvulnerabilityTarget
  maxTargets: number
}

export interface RevengeActionModel {
  type: AbilityActionType.REVENGE
  target: AbilityRevengeTarget
  maxTargets: number
}

export interface MirrorActionModel {
  type: AbilityActionType.MIRROR
  target: AbilityMirrorTarget
  maxTargets: number
}
