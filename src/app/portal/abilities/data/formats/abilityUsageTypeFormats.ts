import { AbilityUsage } from '~/abilities/models/AbilityUsage.model'

export const abilityUsageFormats: Record<AbilityUsage, string> = {
  [AbilityUsage.ONE_TIME]: 'Un solo uso',
  [AbilityUsage.INTERVAL_TIME]: 'Intervalo de tiempo'
}
