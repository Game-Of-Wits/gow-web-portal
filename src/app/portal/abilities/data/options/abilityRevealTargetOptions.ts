import { AbilityRevealTarget } from '~/abilities/models/AbilityRevealTarget.model'
import { SelectOption } from '~/shared/types/SelectOption'
import { abilityRevealTargetFormats } from '../formats/abilityRevealTargetFormats'

export const abilityRevealTargetOptions: SelectOption[] = Object.entries(
  abilityRevealTargetFormats
).map(([key, value]) => ({
  code: key as AbilityRevealTarget,
  name: value
}))
