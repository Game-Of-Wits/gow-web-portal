import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { AbilityActionModel } from './Ability.model'
import { AbilityClassShift } from './AbilityClassShift.model'
import { AbilityType } from './AbilityType.model'
import { AbilityUsage } from './AbilityUsage.model'
import { AbilityUsageInterval } from './AbilityUsageInterval.model'

export interface UpdateAbility {
  name: string
  description: string
  type: AbilityType
  classroomId: string
  usage: {
    type: AbilityUsage
    shift?: AbilityClassShift
    interval?: AbilityUsageInterval
  }
  actions: AbilityActionModel[]
  experience: EducationalExperience
  isInitial: boolean
}
