import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'
import { SchoolGradeYearMapper } from '~/schools/mappers/school-grade-year.mapper'
import { SchoolGradeYearModel } from '~/schools/models/SchoolGradeYear.model'
import { SchoolGradeYearRepository } from '~/schools/repositories/school-grade-year.repository'

@Injectable({ providedIn: 'root' })
export class SchoolGradeYearService {
  private readonly schoolGradeYearRepository = inject(SchoolGradeYearRepository)

  public getGradeYearBySchool(
    schoolId: string
  ): Observable<SchoolGradeYearModel[]> {
    return this.schoolGradeYearRepository
      .getGradeYearsBySchoolId(schoolId)
      .pipe(map(SchoolGradeYearMapper.toListModel))
  }
}
