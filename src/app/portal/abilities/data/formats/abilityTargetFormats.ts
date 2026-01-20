import { AbilityTarget } from '~/abilities/models/AbilityTarget.model'

export const abilityTargetFormats: Record<AbilityTarget, string> = {
  [AbilityTarget.YOURSELF]: 'Tu mismo',
  [AbilityTarget.CLASSMATE]: 'Compañero de aula',
  [AbilityTarget.RANDOM_ENEMY]: 'Enemigo aleatorio',
  [AbilityTarget.ENEMY]: 'Enemigo'
}
