import { EducationLevel } from './EducationLevel.model'
import { GradeYear } from './GradeYear.model'

export interface SchoolGradeYearModel {
  id: string
  section: string | null
  gradeYear: GradeYear
  educationLevel: EducationLevel
}
