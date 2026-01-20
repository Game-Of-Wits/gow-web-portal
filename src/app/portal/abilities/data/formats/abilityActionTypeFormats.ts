import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'

export const abilityActionTypeFormats: Record<AbilityActionType, string> = {
  [AbilityActionType.CLASSROOM]: 'Aula',
  [AbilityActionType.THEFT]: 'Robo de habilidad(es)',
  [AbilityActionType.HEALTH]: 'Vida del estudiante',
  [AbilityActionType.REVEAL]: 'Revelación',
  [AbilityActionType.REVIVE]: 'Recurección',
  [AbilityActionType.ASCENSION]: 'Ascención de habilidades',
  [AbilityActionType.PROTECTION]: 'Protección',
  [AbilityActionType.DEFEREAL_HOMEWORK]: 'Postergación para la entrega de tarea',
  [AbilityActionType.INVULNERABILITY]: 'Invulnerabilidad',
  [AbilityActionType.MIRROR]: 'Reflectar',
  [AbilityActionType.REVENGE]: 'Venganza'
}
