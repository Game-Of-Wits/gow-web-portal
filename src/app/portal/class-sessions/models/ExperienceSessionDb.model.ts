import { DocumentReference, Timestamp } from '@angular/fire/firestore'
import { EducationalExperience } from '~/shared/models/EducationalExperience'

export interface ExperienceSessionDbModel {
  id: string
  experience: EducationalExperience
  classSession: DocumentReference
  startedAt: Timestamp
  endedAt: Timestamp | null
}

export type ExperienceSessionDbWithoutId = Omit<ExperienceSessionDbModel, 'id'>
