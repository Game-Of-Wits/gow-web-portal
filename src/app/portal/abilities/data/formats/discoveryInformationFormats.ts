import { DiscoveryInformation } from '~/abilities/models/DiscoveryInformation.model'

export const discoveryInformationFormats: Record<DiscoveryInformation, string> =
  {
    [DiscoveryInformation.TEAM]: 'Equipo',
    [DiscoveryInformation.ABILITIES]: 'Habilidades',
    [DiscoveryInformation.CHARACTER]: 'Personaje'
  }
