import { FormArray, FormControl, FormGroup } from '@angular/forms'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { AbilityActionModel } from './Ability.model'
import { AbilityActionType } from './AbilityActionType.model'
import { AbilityClassShift } from './AbilityClassShift.model'
import { AbilityLevelScope } from './AbilityLevelScope.model'
import { AbilityModifier } from './AbilityModifier.model'
import { AbilityTarget } from './AbilityTarget.model'
import { AbilityTheftTarget } from './AbilityTheftTarget.model'
import { AbilityType } from './AbilityType.model'
import { AbilityUnitTime } from './AbilityUnitTime.model'
import { AbilityUsage } from './AbilityUsage.model'
import { AbilityUsageInterval } from './AbilityUsageInterval.model'
import { DiscoveryInformation } from './DiscoveryInformation.model'

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
}

export interface AddReviveActionForm {
  type: FormControl<AbilityActionType.REVIVE>
  target: FormControl<AbilityTarget>
}

export interface AddRevealActionForm {
  type: FormControl<AbilityActionType.REVEAL>
  information: FormGroup<{
    [DiscoveryInformation.CHARACTER]: FormControl<boolean>
    [DiscoveryInformation.TEAM]: FormControl<boolean>
    [DiscoveryInformation.ABILITIES]: FormControl<boolean>
  }>
  target: FormControl<AbilityTarget>
}

export interface AddDeferealHomeworkActionForm {
  type: FormControl<AbilityActionType.DEFEREAL_HOMEWORK>
  unitTime: FormControl<AbilityUnitTime>
  time: FormControl<number>
}
