import { EducationalExperience } from '~/shared/models/EducationalExperience'

export interface CreateExperienceSession {
  experience: EducationalExperience
  classSessionId: string
}
