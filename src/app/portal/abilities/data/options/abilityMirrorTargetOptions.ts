import { AbilityMirrorTarget } from '~/abilities/models/AbilityMirrorTarget.model'
import { SelectOption } from '~/shared/types/SelectOption'
import { abilityMirrorTargetFormats } from '../formats/abilityMirrorTargetFormats'

export const abilityMirrorTargetOptions: SelectOption[] = Object.entries(
  abilityMirrorTargetFormats
).map(([key, value]) => ({
  code: key as AbilityMirrorTarget,
  name: value
}))
