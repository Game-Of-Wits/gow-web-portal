import { AbilityUsage } from '~/abilities/models/AbilityUsage.model'
import { SelectOption } from '~/shared/types/SelectOption'
import { abilityUsageFormats } from '../formats'

export const abilityUsageOptions: SelectOption[] = Object.entries(
  abilityUsageFormats
).map(([key, value]) => ({
  code: key as AbilityUsage,
  name: value
}))
