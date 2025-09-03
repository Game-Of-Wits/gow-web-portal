import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { AbilityActionType } from './AbilityActionType.model'
import { AbilityClassShift } from './AbilityClassShift.model'
import { AbilityLevelScope } from './AbilityLevelScope.model'
import { AbilityModifier } from './AbilityModifier.model'
import { AbilityTarget } from './AbilityTarget.model'
import { AbilityTheftTarget } from './AbilityTheftTarget.model'
import { AbilityType } from './AbilityType.model'
import { AbilityUnitTime } from './AbilityUnitTime.model'
import { AbilityUsage } from './AbilityUsage.model'
import { AbilityUsageInterval } from './AbilityUsageInterval.model'
import { DiscoveryInformation } from './DiscoveryInformation.model'

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
}

export interface ReviveActionFormData {
  type: AbilityActionType.REVIVE
  target: AbilityTarget
}

export interface RevealActionFormData {
  type: AbilityActionType.REVEAL
  information: Record<DiscoveryInformation, boolean>
  target: AbilityTarget
}

export interface DeferealHomeworkActionFormData {
  type: AbilityActionType.DEFEREAL_HOMEWORK
  unitTime: AbilityUnitTime
  time: number
}
