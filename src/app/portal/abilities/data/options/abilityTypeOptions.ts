import { AbilityType } from '~/abilities/models/AbilityType.model'
import { SelectOption } from '~/shared/types/SelectOption'
import { abilityTypeFormats } from '../formats'

export const abilityTypeOptions: SelectOption[] = Object.entries(
  abilityTypeFormats
).map(([key, value]) => ({
  code: key as AbilityType,
  name: value
}))
