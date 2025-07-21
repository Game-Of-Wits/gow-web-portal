import { AbilityLevelScope } from '~/abilities/models/AbilityLevelScope.model'

export const abilityLevelScopeFormats: Record<AbilityLevelScope, string> = {
  [AbilityLevelScope.NEXT_LEVEL]: 'Próximo nivel',
  [AbilityLevelScope.ALL_NEXT_LEVELS]: 'Próximos niveles',
  [AbilityLevelScope.PREV_LEVEL]: 'Nivel previo',
  [AbilityLevelScope.ALL_PREV_LEVELS]: 'Niveles previos'
}
