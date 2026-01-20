import { AbilityProtectionTarget } from '../../models/AbilityProtectionTarget.model'

export const abilityProtectionTargetFormats: Record<
  AbilityProtectionTarget,
  string
> = {
  [AbilityProtectionTarget.YOURSELF]: 'Tu mismo',
  [AbilityProtectionTarget.CLASSMATE]: 'Compañero de aula',
  [AbilityProtectionTarget.RANDOM_ENEMY]: 'Enemigo aleatorio',
  [AbilityProtectionTarget.ENEMY]: 'Enemigo'
}
