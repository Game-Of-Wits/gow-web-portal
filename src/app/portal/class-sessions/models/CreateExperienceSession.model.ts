import { ClassShift } from '~/shared/models/ClassShift'
import { EducationalExperience } from '~/shared/models/EducationalExperience'

export interface CreateExperienceSession {
  experience: EducationalExperience
  classSessionId: string
  rules?: {
    shift: ClassShift
  }
}
