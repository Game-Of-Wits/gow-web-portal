import { EducationalExperience } from '~/shared/models/EducationalExperience'

export interface ClassroomModel {
  id: string
  name: string
  studentIds: string[]
  teacherId: string
  schoolId: string
  gradeYearId: string
  isSetupReady: boolean
  experiences: {
    [EducationalExperience.SHADOW_WARFARE]: ClassroomShadowWarfareExperienceModel
    [EducationalExperience.MASTERY_ROAD]: ClassroomMasteryRoadExperienceModel
  }
}

export interface ClassroomShadowWarfareExperienceModel {
  healthPointsBase: number
  limitAbilities: number
}

export interface ClassroomMasteryRoadExperienceModel {
  levels: string[]
}
