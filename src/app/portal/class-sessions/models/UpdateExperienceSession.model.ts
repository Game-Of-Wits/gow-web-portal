import { DocumentReference, FieldValue } from '@angular/fire/firestore'
import { EducationalExperience } from '~/shared/models/EducationalExperience'

export interface UpdateExperienceSessionDb {
  experience: EducationalExperience
  classSession: DocumentReference
  startedAt: FieldValue
  endedAt: FieldValue | null
}
