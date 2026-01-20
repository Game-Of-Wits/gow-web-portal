import { AbilityProtectionTarget } from '~/abilities/models/AbilityProtectionTarget.model'
import { SelectOption } from '~/shared/types/SelectOption'
import { abilityProtectionTargetFormats } from '../formats/abilityProtectionTargetFormats'

export const abilityProtectionTargetOptions: SelectOption[] = Object.entries(
  abilityProtectionTargetFormats
).map(([key, value]) => ({
  code: key as AbilityProtectionTarget,
  name: value
}))
