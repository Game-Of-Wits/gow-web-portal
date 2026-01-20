import { AbilityReviveTarget } from '~/abilities/models/AbilityReviveTarget.model'
import { SelectOption } from '~/shared/types/SelectOption'
import { abilityReviveTargetFormats } from '../formats/abilityReviveTargetFormats'

export const abilityReviveTargetOptions: SelectOption[] = Object.entries(
  abilityReviveTargetFormats
).map(([key, value]) => ({
  code: key as AbilityReviveTarget,
  name: value
}))
