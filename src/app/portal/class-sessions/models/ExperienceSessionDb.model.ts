import { DocumentReference, Timestamp } from '@angular/fire/firestore'
import { ClassShift } from '~/shared/models/ClassShift'
import { EducationalExperience } from '~/shared/models/EducationalExperience'

export interface ExperienceSessionDbModel {
  id: string
  experience: EducationalExperience
  classSession: DocumentReference
  startedAt: Timestamp
  endedAt: Timestamp | null
  rules?: {
    shift: ClassShift
  }
}
