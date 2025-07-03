import { EducationLevel } from '../models/EducationLevel.model'
import { GradeYear } from '../models/GradeYear.model'
import { SchoolGradeYearModel } from '../models/SchoolGradeYear.model'
import { SchoolGradeYearDbModel } from '../models/SchoolGradeYearDb.model'

export class SchoolGradeYearMapper {
  public static toModel(
    gradeYear: SchoolGradeYearDbModel
  ): SchoolGradeYearModel {
    return {
      id: gradeYear.id,
      gradeYear: gradeYear.gradeYear as GradeYear,
      educationLevel: gradeYear.educationLevel as EducationLevel,
      section: gradeYear.section
    }
  }

  public static toListModel(
    gradeYears: SchoolGradeYearDbModel[]
  ): SchoolGradeYearModel[] {
    return gradeYears.map(SchoolGradeYearMapper.toModel)
  }
}
