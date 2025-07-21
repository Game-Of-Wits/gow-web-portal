import { AbilityUnitTime } from '~/abilities/models/AbilityUnitTime.model'

export const abilityUnitTimeFormats: Record<AbilityUnitTime, string> = {
  [AbilityUnitTime.HOURS]: 'Horas',
  [AbilityUnitTime.DAYS]: 'Días'
}
