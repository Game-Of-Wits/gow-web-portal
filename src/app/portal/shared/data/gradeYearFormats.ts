import { GradeYear } from '~/schools/models/GradeYear.model'

export const gradeYearFormats: Record<GradeYear, string> = {
  [GradeYear.THIRD]: '3ro',
  [GradeYear.FOURTH]: '4to',
  [GradeYear.FIFTH]: '5to'
}
