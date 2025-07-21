import { AbilityLevelScope } from '~/abilities/models/AbilityLevelScope.model'
import { SelectOption } from '~/shared/types/SelectOption'
import { abilityLevelScopeFormats } from '../formats'

export const abilityLevelScopeOptions: SelectOption[] = Object.entries(
  abilityLevelScopeFormats
).map(([key, value]) => ({
  name: value,
  code: key as AbilityLevelScope
}))
