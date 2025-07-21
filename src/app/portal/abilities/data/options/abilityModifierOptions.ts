import { AbilityModifier } from '~/abilities/models/AbilityModifier.model'
import { SelectOption } from '~/shared/types/SelectOption'
import { abilityModifierFormats } from '../formats'

export const abilityModifierOptions: SelectOption[] = Object.entries(
  abilityModifierFormats
).map(([key, value]) => ({
  code: key as AbilityModifier,
  name: value
}))
