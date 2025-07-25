import { AbilityFormData } from '~/abilities/models/AbilityFormData.model'
import { CharacterFormData } from '~/characters/models/CharacterFormData.model'
import { LevelModel } from '~/levels/models/Level.model'
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
    healthPointBase: number
    limitAbilities: number
  }
  initialCharacters: CharacterFormData[]
  initialAbilities: AbilityFormData[]
}

export interface CreateClassroomMasteryRoadExperienceModel {
  levels: {
    initialLevel: LevelModel
    list: LevelModel[]
  }
  penalties: PenaltyFormData[]
}
