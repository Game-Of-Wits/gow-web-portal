import { AbilityTheftTarget } from '~/abilities/models/AbilityTheftTarget.model'
import { SelectOption } from '~/shared/types/SelectOption'
import { abilityTheftTargetFormats } from '../formats'

export const abilityTheftTargetOptions: SelectOption[] = Object.entries(
  abilityTheftTargetFormats
).map(([key, value]) => ({
  code: key as AbilityTheftTarget,
  name: value
}))
