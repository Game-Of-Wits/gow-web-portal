import { AbilityClassShift } from '~/abilities/models/AbilityClassShift.model'
import { SelectOption } from '~/shared/types/SelectOption'
import { abilityClassShiftFormats } from '../formats'

export const abilityClassShiftOptions: SelectOption[] = Object.entries(
  abilityClassShiftFormats
).map(([key, value]) => ({
  code: key as AbilityClassShift,
  name: value
}))
