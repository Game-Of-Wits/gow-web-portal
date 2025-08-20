import { FormArray, FormControl, FormGroup } from '@angular/forms'
import { AbilityForm } from '~/abilities/models/AbilityForm.model'
import { CharacterForm } from '~/characters/models/CharacterForm.model'
import { LevelForm } from '~/levels/models/LevelForm.model'
import { PenaltyForm } from '~/penalties/models/PenaltyForm.model'

export interface CreateClassroomForm {
  name: FormControl<string>
  gradeYearId: FormControl<string>
  experiences: FormGroup<{
    SHADOW_WARFARE: FormGroup<CreateClassroomShadowWarfareExperienceForm>
    MASTERY_ROAD: FormGroup<CreateClassroomMasteryRoadExperienceForm>
  }>
}

export interface CreateClassroomShadowWarfareExperienceForm {
  teams: FormGroup<{
    firstTeamName: FormControl<string>
    secondTeamName: FormControl<string>
  }>
  character: FormGroup<{
    healthPointsBase: FormControl<number>
    limitAbilities: FormControl<number>
  }>
  initialCharacters: FormArray<FormGroup<CharacterForm>>
  initialAbilities: FormArray<FormGroup<AbilityForm>>
}

export interface CreateClassroomMasteryRoadExperienceForm {
  levels: FormGroup<{
    initialLevel: FormGroup<LevelForm>
    list: FormArray<FormGroup<LevelForm>>
  }>
  penalties: FormArray<FormGroup<PenaltyForm>>
}
