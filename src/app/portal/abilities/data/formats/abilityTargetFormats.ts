import { AbilityTarget } from '~/abilities/models/AbilityTarget.model'

export const abilityTargetFormats: Record<AbilityTarget, string> = {
  [AbilityTarget.YOURSELF]: 'Tu mismo',
  [AbilityTarget.CLASSMATE]: 'Compañero',
  [AbilityTarget.RANDOM_ENEMY]: 'Enemigo aleatorio'
}
