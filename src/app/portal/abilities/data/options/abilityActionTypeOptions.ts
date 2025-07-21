import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { SelectOption } from '~/shared/types/SelectOption'
import { abilityActionTypeFormats } from '../formats'

export const abilityActionTypeOptions: SelectOption[] = Object.entries(
  abilityActionTypeFormats
).map(([key, value]) => ({
  code: key as AbilityActionType,
  name: value
}))
