import { AbilityClassShift } from '~/abilities/models/AbilityClassShift.model'

export const abilityClassShiftFormats: Record<AbilityClassShift, string> = {
  [AbilityClassShift.ALL]: 'Todo el día',
  [AbilityClassShift.NIGHT]: 'Solo la noche',
  [AbilityClassShift.AFTERNOON]: 'Solo en la tarde',
  [AbilityClassShift.MORNING]: 'Solo en la mañana'
}
