import { FormArray, FormControl, FormGroup } from '@angular/forms'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { AbilityActionModel } from './Ability.model'
import { AbilityActionType } from './AbilityActionType.model'
import { AbilityClassShift } from './AbilityClassShift.model'
import { AbilityHealthTarget } from './AbilityHealthTarget.model'
import { AbilityLevelScope } from './AbilityLevelScope.model'
import { AbilityModifier } from './AbilityModifier.model'
import { AbilityProtectionTarget } from './AbilityProtectionTarget.model'
import { AbilityTarget } from './AbilityTarget.model'
import { AbilityTheftTarget } from './AbilityTheftTarget.model'
import { AbilityType } from './AbilityType.model'
import { AbilityUnitTime } from './AbilityUnitTime.model'
import { AbilityUsage } from './AbilityUsage.model'
import { AbilityUsageInterval } from './AbilityUsageInterval.model'
import { DiscoveryInformation } from './DiscoveryInformation.model'
import { AbilityReviveTarget } from './AbilityReviveTarget.model'
import { AbilityRevealTarget } from './AbilityRevealTarget.model'
import { AbilityInvulnerabilityTarget } from './AbilityInvulnerabilityTarget.model'
import { AbilityRevengeTarget } from './AbilityRevengeTarget.model'
import { AbilityMirrorTarget } from './AbilityMirrorTarget.model'

export interface AbilityFormDefaultValues {
  name: string
  description: string
  type: AbilityType
  usage: {
    type: AbilityUsage
    shift?: AbilityClassShift
    interval?: AbilityUsageInterval
  }
  actions: AbilityActionModel[]
  experience: EducationalExperience
  isInitial: boolean
}

export interface AbilityForm {
  name: FormControl<string>
  description: FormControl<string>
  type: FormControl<AbilityType>
  usage: FormGroup<{
    type: FormControl<AbilityUsage>
    shift: FormControl<AbilityClassShift>
    interval: FormControl<AbilityUsageInterval>
  }>
  actions: FormArray<AbilityActionForm>
  experience: FormControl<EducationalExperience>
  isInitial: FormControl<boolean>
}

export type AbilityActionForm =
  | FormGroup<AddClassroomActionForm>
  | FormGroup<AddAscensionActionForm>
  | FormGroup<AddTheftActionForm>
  | FormGroup<AddHealthActionForm>
  | FormGroup<AddReviveActionForm>
  | FormGroup<AddRevealActionForm>
  | FormGroup<AddDeferealHomeworkActionForm>
  | FormGroup<AddProtectionActionForm>
  | FormGroup<AddInvulnerabilityActionForm>
  | FormGroup<AddMirrorActionForm>
  | FormGroup<AddRevengeActionForm>

export interface AddClassroomActionForm {
  type: FormControl<AbilityActionType.CLASSROOM>
}

export interface AddAscensionActionForm {
  type: FormControl<AbilityActionType.ASCENSION>
  taken: FormControl<number>
  given: FormControl<number>
  takenLevelScope: FormControl<AbilityLevelScope>
}

export interface AddTheftActionForm {
  type: FormControl<AbilityActionType.THEFT>
  numberOfAbilities: FormControl<number>
  target: FormControl<AbilityTheftTarget>
}

export interface AddHealthActionForm {
  type: FormControl<AbilityActionType.HEALTH>
  modifier: FormControl<AbilityModifier>
  healthPoints: FormControl<number>
  target: FormControl<AbilityHealthTarget>
  maxTargets: FormControl<number>
}

export interface AddReviveActionForm {
  type: FormControl<AbilityActionType.REVIVE>
  target: FormControl<AbilityReviveTarget>
  maxTargets: FormControl<number>
}

export interface AddRevealActionForm {
  type: FormControl<AbilityActionType.REVEAL>
  information: FormGroup<{
    [DiscoveryInformation.CHARACTER]: FormControl<boolean>
    [DiscoveryInformation.TEAM]: FormControl<boolean>
    [DiscoveryInformation.ABILITIES]: FormControl<boolean>
  }>
  target: FormControl<AbilityRevealTarget>
  maxTargets: FormControl<number>
}

export interface AddDeferealHomeworkActionForm {
  type: FormControl<AbilityActionType.DEFEREAL_HOMEWORK>
  unitTime: FormControl<AbilityUnitTime>
  time: FormControl<number>
}

export interface AddProtectionActionForm {
  type: FormControl<AbilityActionType.PROTECTION>
  target: FormControl<AbilityProtectionTarget>
  maxTargets: FormControl<number>
}

export interface AddInvulnerabilityActionForm {
  type: FormControl<AbilityActionType.INVULNERABILITY>
  target: FormControl<AbilityInvulnerabilityTarget>
  maxTargets: FormControl<number>
}

export interface AddRevengeActionForm {
  type: FormControl<AbilityActionType.REVENGE>
  target: FormControl<AbilityRevengeTarget>
  maxTargets: FormControl<number>
}

export interface AddMirrorActionForm {
  type: FormControl<AbilityActionType.MIRROR>
  target: FormControl<AbilityMirrorTarget>
  maxTargets: FormControl<number>
}
