import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { AbilityClassShift } from './AbilityClassShift.model'
import { AbilityType } from './AbilityType.model'
import { AbilityUsage } from './AbilityUsage.model'
import { AbilityUsageInterval } from './AbilityUsageInterval.model'

export interface InitialAbilityFormData {
  name: string
  description: string
  type: AbilityType
  usage: {
    type: AbilityUsage
    shift: AbilityClassShift
    interval: AbilityUsageInterval
  }
  experience: EducationalExperience
  isInitial: boolean
}
