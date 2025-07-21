import { AbilityType } from '~/abilities/models/AbilityType.model'

export const abilityTypeFormats: Record<AbilityType, string> = {
  [AbilityType.BENEFIT]: 'Beneficio',
  [AbilityType.STRATEGIC]: 'Estrategia',
  [AbilityType.DAMAGE]: 'Daño',
  [AbilityType.PROTECT]: 'Protección',
  [AbilityType.HELP_CLASSMATE]: 'Ayuda a compañero',
  [AbilityType.MULTIPLE_ATTACKS]: 'Ataque multiple',
  [AbilityType.MULTIPLE_BENEFITS]: 'Beneficios multiples'
}
