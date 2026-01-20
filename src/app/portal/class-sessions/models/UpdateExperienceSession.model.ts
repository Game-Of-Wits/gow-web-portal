import { DocumentReference, FieldValue } from '@angular/fire/firestore'
import { ClassShift } from '~/shared/models/ClassShift'
import { EducationalExperience } from '~/shared/models/EducationalExperience'

export interface UpdateExperienceSessionDb {
  experience: EducationalExperience
  classSession: DocumentReference
  startedAt: FieldValue
  endedAt: FieldValue | null
  rules?: {
    shift: ClassShift
  }
}
