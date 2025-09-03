import { ClassShift } from '~/shared/models/ClassShift'
import { EducationalExperience } from '~/shared/models/EducationalExperience'

export interface ExperienceSessionModel {
  id: string
  experience: EducationalExperience
  classSessionId: string
  startedAt: Date
  endedAt: Date | null
  rules?: { shift: ClassShift }
}
