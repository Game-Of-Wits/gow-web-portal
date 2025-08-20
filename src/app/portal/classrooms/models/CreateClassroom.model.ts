import { InitialAbilityFormData } from '~/abilities/models/InitialAbilityFormData.model'
import { CharacterFormData } from '~/characters/models/CharacterFormData.model'
import { LevelFormData } from '~/levels/models/LevelFormData.model'
import { PenaltyFormData } from '~/penalties/models/PenaltyFormData.model'

export interface CreateClassroomModel {
  name: string
  schoolId: string
  teacherId: string
  gradeYearId: string
  experiences: {
    SHADOW_WARFARE: CreateClassroomShadowWarfareExperienceModel
    MASTERY_ROAD: CreateClassroomMasteryRoadExperienceModel
  }
}

export interface CreateClassroomShadowWarfareExperienceModel {
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

export interface CreateClassroomMasteryRoadExperienceModel {
  levels: {
    initialLevel: LevelFormData
    list: LevelFormData[]
  }
  penalties: PenaltyFormData[]
}
