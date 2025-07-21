import { AbilityUsage } from '~/abilities/models/AbilityUsage.model'

export const abilityUsageFormats: Record<AbilityUsage, string> = {
  [AbilityUsage.ONE_TIME]: 'Una sola vez',
  [AbilityUsage.INTERVAL_TIME]: 'Intervalo de tiempo'
}
