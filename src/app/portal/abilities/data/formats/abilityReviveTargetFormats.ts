import { AbilityReviveTarget } from '~/abilities/models/AbilityReviveTarget.model'

export const abilityReviveTargetFormats: Record<AbilityReviveTarget, string> = {
  [AbilityReviveTarget.YOURSELF]: 'Tu mismo',
  [AbilityReviveTarget.CLASSMATE]: 'Compañero de aula',
  [AbilityReviveTarget.RANDOM_ENEMY]: 'Enemigo aleatorio',
  [AbilityReviveTarget.ENEMY]: 'Enemigo'
}
