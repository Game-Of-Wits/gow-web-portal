import { EducationalExperience } from '~/shared/models/EducationalExperience'

export interface StudentPeriodStatesModel {
  id: string
  studentId: string
  academicPeriodId: string
  classroomId: string
  experiences: Map<EducationalExperience, StudentPeriodStateExperience>
}

export type StudentPeriodStateExperience =
  | ShadowWarfareExperienceState
  | MasteryRoadExperienceState

export interface ShadowWarfareExperienceState {
  healthPoints: number
  teamId: string
  characterId: string
  pendingHomeworks: PendingHomework[]
  abilityIds: string[]
}

export interface MasteryRoadExperienceState {
  progressPoints: number
  currentLevelId: string
  levelRewardIds: string[]
  abilityIds: string[]
}

export interface PendingHomework {
  homeworkId: string
  dateLimit: Date
}
