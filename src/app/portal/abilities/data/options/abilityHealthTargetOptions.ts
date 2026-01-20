import { AbilityHealthTarget } from '~/abilities/models/AbilityHealthTarget.model'
import { SelectOption } from '~/shared/types/SelectOption'
import { abilityHealthTargetFormats } from '../formats/abilityHealthTargetFormats'

export const abilityHealthTargetOptions: SelectOption[] = Object.entries(
  abilityHealthTargetFormats
).map(([key, value]) => ({
  code: key as AbilityHealthTarget,
  name: value
}))
