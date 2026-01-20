import { AbilityRevengeTarget } from '~/abilities/models/AbilityRevengeTarget.model'

export const abilityRevengeTargetFormats: Record<AbilityRevengeTarget, string> = {
  [AbilityRevengeTarget.YOURSELF]: 'Tu mismo',
  [AbilityRevengeTarget.CLASSMATE]: 'Compañero de aula',
  [AbilityRevengeTarget.RANDOM_ENEMY]: 'Enemigo aleatorio',
  [AbilityRevengeTarget.ENEMY]: 'Enemigo'
}
