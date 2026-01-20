import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import {
  AbilityActionModel,
  AscensionActionModel,
  ClassroomActionModel,
  DeferealHomeworkActionModel,
  HealthActionModel,
  ProtectionActionModel,
  RevealActionModel,
  ReviveActionModel,
  TheftActionModel
} from '../models/Ability.model'

export const actionGuardValidators = [
  isClassroomAction,
  isTheftAction,
  isHealthAction,
  isReviveAction,
  isRevealAction,
  isClassroomAction,
  isProtectionAction,
  isDeferralHomeworkAction
]

export function isClassroomAction(
  action: AbilityActionModel
): action is ClassroomActionModel {
  return action.type === AbilityActionType.CLASSROOM
}

export function isAscensionAction(
  action: AbilityActionModel
): action is AscensionActionModel {
  return action.type === AbilityActionType.ASCENSION
}

export function isTheftAction(
  action: AbilityActionModel
): action is TheftActionModel {
  return action.type === AbilityActionType.THEFT
}

export function isHealthAction(
  action: AbilityActionModel
): action is HealthActionModel {
  return action.type === AbilityActionType.HEALTH
}

export function isReviveAction(
  action: AbilityActionModel
): action is ReviveActionModel {
  return action.type === AbilityActionType.REVIVE
}

export function isRevealAction(
  action: AbilityActionModel
): action is RevealActionModel {
  return action.type === AbilityActionType.REVEAL
}

export function isDeferralHomeworkAction(
  action: AbilityActionModel
): action is DeferealHomeworkActionModel {
  return action.type === AbilityActionType.DEFEREAL_HOMEWORK
}

export function isProtectionAction(
  action: AbilityActionModel
): action is ProtectionActionModel {
  return action.type === AbilityActionType.PROTECTION
}

export function isAbilityAction(
  a: AbilityActionModel,
  b: AbilityActionModel
): boolean {
  return actionGuardValidators.some(
    guardValidator => guardValidator(a) && guardValidator(b)
  )
}
