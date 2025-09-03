import { RevealActionModel } from './Ability.model'
import {
  AscensionActionFormData,
  ClassroomActionFormData,
  DeferealHomeworkActionFormData,
  HealthActionFormData,
  ReviveActionFormData,
  TheftActionFormData
} from './AbilityFormData.model'

export type AddAbilityAction =
  | ClassroomActionFormData
  | AscensionActionFormData
  | TheftActionFormData
  | HealthActionFormData
  | ReviveActionFormData
  | RevealActionModel
  | DeferealHomeworkActionFormData
