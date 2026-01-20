import { AbilityMirrorTarget } from '../../models/AbilityMirrorTarget.model'

export const abilityMirrorTargetFormats: Record<AbilityMirrorTarget, string> = {
  [AbilityMirrorTarget.YOURSELF]: 'Tu mismo',
  [AbilityMirrorTarget.CLASSMATE]: 'Compañero de aula',
  [AbilityMirrorTarget.RANDOM_ENEMY]: 'Enemigo aleatorio',
  [AbilityMirrorTarget.ENEMY]: 'Enemigo'
}
