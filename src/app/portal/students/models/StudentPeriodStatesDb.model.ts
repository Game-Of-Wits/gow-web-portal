import { DocumentReference, Timestamp } from '@angular/fire/firestore'

export interface StudentPeriodStatesDbModel {
  id: string
  student: DocumentReference
  academicPeriod: DocumentReference
  experiences: { [key: string]: StudentPeriodStateDbExperience }
}

export type StudentPeriodStateDbExperience =
  | ShadowWarfareExperienceStateDb
  | MasteryRoadExperienceStateDb

export interface ShadowWarfareExperienceStateDb {
  healthPoints: number
  team: DocumentReference
  character: DocumentReference
  pendingHomeworks: PendingHomeworkDb[]
  abilities: DocumentReference[]
}

export interface MasteryRoadExperienceStateDb {
  progressPoints: number
  currentLevel: DocumentReference
  levelRewards: DocumentReference[]
  abilities: DocumentReference[]
}

export interface PendingHomeworkDb {
  homework: DocumentReference
  dateLimit: Timestamp
}
