import { AbilityTheftTarget } from '~/abilities/models/AbilityTheftTarget.model'

export const abilityTheftTargetFormats: Record<AbilityTheftTarget, string> = {
  [AbilityTheftTarget.CLASSMATE]: 'Compañero de aula',
  [AbilityTheftTarget.ENEMY]: 'Enemigo'
}
