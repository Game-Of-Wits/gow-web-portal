import { AbilityModifier } from '~/abilities/models/AbilityModifier.model'

export const abilityModifierFormats: Record<AbilityModifier, string> = {
  [AbilityModifier.INCREMENT]: 'Incrementar',
  [AbilityModifier.DECREASE]: 'Decrementar'
}
