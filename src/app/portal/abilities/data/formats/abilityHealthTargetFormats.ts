import { AbilityHealthTarget } from '../../models/AbilityHealthTarget.model'

export const abilityHealthTargetFormats: Record<AbilityHealthTarget, string> = {
  [AbilityHealthTarget.YOURSELF]: 'Tu mismo',
  [AbilityHealthTarget.CLASSMATE]: 'Compañero de aula',
  [AbilityHealthTarget.RANDOM_ENEMY]: 'Enemigo aleatorio',
  [AbilityHealthTarget.ENEMY]: 'Enemigo'
}
