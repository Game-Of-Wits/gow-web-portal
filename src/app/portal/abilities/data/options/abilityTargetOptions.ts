import { AbilityTarget } from '~/abilities/models/AbilityTarget.model'
import { SelectOption } from '~/shared/types/SelectOption'
import { abilityTargetFormats } from '../formats'

export const abilityTargetOptions: SelectOption[] = Object.entries(
  abilityTargetFormats
).map(([key, value]) => ({
  code: key as AbilityTarget,
  name: value
}))
