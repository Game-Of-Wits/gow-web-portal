import { Injectable, inject } from '@angular/core'
import {
  collection,
  collectionData,
  Firestore,
  Query,
  query,
  where
} from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { SchoolGradeYearDbModel } from '../models/SchoolGradeYearDb.model'
import { SchoolRepository } from './school.repository'

@Injectable({ providedIn: 'root' })
export class SchoolGradeYearRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'school_grade_years'
  private readonly collectionName = SchoolGradeYearRepository.collectionName

  public getGradeYearsBySchoolId(
    schoolId: string
  ): Observable<SchoolGradeYearDbModel[]> {
    const schoolRef = SchoolRepository.getSchoolRefById(
      this.firestore,
      schoolId
    )

    const gradeYearsQuery = query(
      this.getGradeYearsRef(),
      where('school', '==', schoolRef)
    ) as Query<SchoolGradeYearDbModel>

    return collectionData<SchoolGradeYearDbModel>(gradeYearsQuery, {
      idField: 'id'
    })
  }

  private getGradeYearsRef() {
    return collection(this.firestore, this.collectionName)
  }
}
