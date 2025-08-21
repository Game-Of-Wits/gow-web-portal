import { Injectable, inject } from '@angular/core'
import {
  collection,
  Firestore,
  getDocs,
  query,
  where
} from '@angular/fire/firestore'
import { SchoolGradeYearDbModel } from '../models/SchoolGradeYearDb.model'
import { SchoolRepository } from './school.repository'

@Injectable({ providedIn: 'root' })
export class SchoolGradeYearRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'school_grade_years'
  private readonly collectionName = SchoolGradeYearRepository.collectionName

  public async getGradeYearsBySchoolId(
    schoolId: string
  ): Promise<SchoolGradeYearDbModel[]> {
    const schoolRef = SchoolRepository.getSchoolRefById(
      this.firestore,
      schoolId
    )

    const gradeYearsQuery = query(
      this.getCollectionRef(),
      where('school', '==', schoolRef)
    )

    const gradeYearsSnapshot = await getDocs(gradeYearsQuery)

    return gradeYearsSnapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() }) as SchoolGradeYearDbModel
    )
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }
}
