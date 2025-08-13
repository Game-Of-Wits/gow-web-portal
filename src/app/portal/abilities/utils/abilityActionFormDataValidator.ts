import { FormGroup } from '@angular/forms'
import { AbilityActionType } from '../models/AbilityActionType.model'
import {
  AbilityActionForm,
  AddAscensionActionForm,
  AddClassroomActionForm,
  AddDeferealHomeworkActionForm,
  AddHealthActionForm,
  AddRevealActionForm,
  AddReviveActionForm,
  AddTheftActionForm
} from '../models/AbilityForm.model'

export const actionFormGuardValidators = [
  isClassroomActionForm,
  isTheftActionForm,
  isHealthActionForm,
  isReviveActionForm,
  isRevealActionForm,
  isClassroomActionForm,
  isDeferralHomeworkActionForm
]

export function isClassroomActionFormData(
  action: AbilityActionForm
): action is FormGroup<AddClassroomActionForm> {
  return action.value.type === AbilityActionType.CLASSROOM
}

export function isAscensionActionFormData(
  action: AbilityActionForm
): action is FormGroup<AddAscensionActionForm> {
  return action.value.type === AbilityActionType.ASCENSION
}

export function isTheftActionFormData(
  action: AbilityActionForm
): action is FormGroup<AddTheftActionForm> {
  return action.value.type === AbilityActionType.THEFT
}

export function isHealthActionFormData(
  action: AbilityActionForm
): action is FormGroup<AddHealthActionForm> {
  return action.value.type === AbilityActionType.HEALTH
}

export function isReviveActionFormData(
  action: AbilityActionForm
): action is FormGroup<AddReviveActionForm> {
  return action.value.type === AbilityActionType.REVIVE
}

export function isRevealActionFormData(
  action: AbilityActionForm
): action is FormGroup<AddRevealActionForm> {
  return action.value.type === AbilityActionType.REVEAL
}

export function isDeferralHomeworkActionFormData(
  action: AbilityActionForm
): action is FormGroup<AddDeferealHomeworkActionForm> {
  return action.value.type === AbilityActionType.DEFEREAL_HOMEWORK
}
export function isAbilityActionFormData(
  a: AbilityActionForm,
  b: AbilityActionForm
): boolean {
  return actionFormGuardValidators.some(
    guardValidator => guardValidator(a) && guardValidator(b)
  )
}
