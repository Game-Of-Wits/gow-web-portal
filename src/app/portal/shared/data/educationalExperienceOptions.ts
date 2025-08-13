import { AbilityUsage } from '~/abilities/models/AbilityUsage.model'
import { SelectOption } from '../types/SelectOption'
import { educationalExperienceFormats } from './educationalExperienceFormats'

export const educationalExperienceOptions: SelectOption[] = Object.entries(
  educationalExperienceFormats
).map(([key, value]) => ({
  name: value,
  code: key as AbilityUsage
}))
