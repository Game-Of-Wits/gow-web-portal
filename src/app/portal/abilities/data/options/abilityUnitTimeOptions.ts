import { AbilityUnitTime } from '~/abilities/models/AbilityUnitTime.model'
import { SelectOption } from '~/shared/types/SelectOption'
import { abilityUnitTimeFormats } from '../formats'

export const abilityUnitTimeOptions: SelectOption[] = Object.entries(
  abilityUnitTimeFormats
).map(([key, value]) => ({
  code: key as AbilityUnitTime,
  name: value
}))
