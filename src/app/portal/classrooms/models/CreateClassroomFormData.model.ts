import { InitialAbilityFormData } from '~/abilities/models/InitialAbilityFormData.model'
import { CharacterFormData } from '~/characters/models/CharacterFormData.model'
import { LevelFormData } from '~/levels/models/LevelFormData.model'
import { PenaltyFormData } from '~/penalties/models/PenaltyFormData.model'

export interface CreateClassroomFormData {
  name: string
  gradeYearId: string
  experiences: {
    SHADOW_WARFARE: CreateClassroomShadowWarfareExperienceFormData
    MASTERY_ROAD: CreateClassroomMasteryRoadExperienceFormData
  }
}

export interface CreateClassroomShadowWarfareExperienceFormData {
  teams: {
    firstTeamName: string
    secondTeamName: string
  }
  character: {
    healthPointsBase: number
    limitAbilities: number
  }
  initialCharacters: CharacterFormData[]
  initialAbilities: InitialAbilityFormData[]
}

export interface CreateClassroomMasteryRoadExperienceFormData {
  levels: {
    initialLevel: LevelFormData
    list: LevelFormData[]
  }
  penalties: PenaltyFormData[]
}
