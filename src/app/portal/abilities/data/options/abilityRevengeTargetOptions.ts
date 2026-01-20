import { AbilityRevengeTarget } from '~/abilities/models/AbilityRevengeTarget.model'
import { SelectOption } from '~/shared/types/SelectOption'
import { abilityRevengeTargetFormats } from '../formats/abilityRevengeTargetFormats'

export const abilityRevengeTargetOptions: SelectOption[] = Object.entries(
  abilityRevengeTargetFormats
).map(([key, value]) => ({
  code: key as AbilityRevengeTarget,
  name: value
}))
