import { AbilityRevealTarget } from '~/abilities/models/AbilityRevealTarget.model'

export const abilityRevealTargetFormats: Record<AbilityRevealTarget, string> = {
  [AbilityRevealTarget.YOURSELF]: 'Tu mismo',
  [AbilityRevealTarget.CLASSMATE]: 'Compañero de aula',
  [AbilityRevealTarget.RANDOM_ENEMY]: 'Enemigo aleatorio',
  [AbilityRevealTarget.ENEMY]: 'Enemigo'
}
