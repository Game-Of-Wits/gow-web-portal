import { Injectable, inject } from '@angular/core'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { SchoolGradeYearMapper } from '~/schools/mappers/school-grade-year.mapper'
import { SchoolGradeYearModel } from '~/schools/models/SchoolGradeYear.model'
import { SchoolGradeYearRepository } from '~/schools/repositories/school-grade-year.repository'

@Injectable({ providedIn: 'root' })
export class SchoolGradeYearService {
  private readonly schoolGradeYearRepository = inject(SchoolGradeYearRepository)

  public async getGradeYearBySchoolId(
    schoolId: string
  ): Promise<SchoolGradeYearModel[]> {
    try {
      const gradeYears =
        await this.schoolGradeYearRepository.getGradeYearsBySchoolId(schoolId)
      return SchoolGradeYearMapper.toListModel(gradeYears)
    } catch (err) {
      const error = err as ErrorResponse
      throw new ErrorResponse(error.code)
    }
  }
}
