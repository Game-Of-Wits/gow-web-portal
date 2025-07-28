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

export interface AbilityModel {
  id: string
  name: string
  description: string
  type: AbilityType
  usage: {
    type: AbilityUsage
    shift: AbilityClassShift
    interval: AbilityUsageInterval
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
}

export interface ReviveActionModel {
  type: AbilityActionType.REVIVE
  target: AbilityTarget
}

export interface RevealActionModel {
  type: AbilityActionType.REVEAL
  information: DiscoveryInformation[]
  target: AbilityTarget
}

export interface DeferealHomeworkActionModel {
  type: AbilityActionType.DEFEREAL_HOMEWORK
  unitTime: AbilityUnitTime
  time: number
}
