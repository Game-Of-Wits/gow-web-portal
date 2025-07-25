import { EducationalExperience } from '~/shared/models/EducationalExperience'

export interface StudentModel {
  id: string
  profileId: string
  classroomId: string
  experiences: Map<EducationalExperience, string>
}
