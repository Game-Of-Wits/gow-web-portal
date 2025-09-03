import { DocumentReference } from '@angular/fire/firestore'
import { EducationalExperience } from '~/shared/models/EducationalExperience'

export interface ClassroomDbModel {
  id: string
  name: string
  students: DocumentReference[]
  teacher: DocumentReference
  school: DocumentReference
  gradeYear: DocumentReference
  experiences: {
    [EducationalExperience.SHADOW_WARFARE]: ClassroomShadowWarfareExperienceDbModel
    [EducationalExperience.MASTERY_ROAD]: ClassroomMasteryRoadExperienceDbModel
  }
}

export type ClassroomDbWithoutId = Omit<ClassroomDbModel, 'id'>

export interface ClassroomShadowWarfareExperienceDbModel {
  healthPointsBase: number
  limitAbilities: number
}

export interface ClassroomMasteryRoadExperienceDbModel {
  levels: DocumentReference[]
}
