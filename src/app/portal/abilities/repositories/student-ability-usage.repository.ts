import { Injectable, inject } from '@angular/core'
import {
  collection,
  collectionData,
  doc,
  Firestore,
  orderBy,
  Query,
  query,
  where
} from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { ExperienceSessionRepository } from '~/class-sessions/repositories/experience-session.repository'
import { StudentAbilityUsageDbModel } from '../models/StudentAbilityUsageDb.model'

@Injectable({ providedIn: 'root' })
export class StudentAbilityUsageRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'student_ability_usages'
  private readonly collectionName = StudentAbilityUsageRepository.collectionName

  public getAllByExperienceSessionId(
    experienceSessionId: string
  ): Observable<StudentAbilityUsageDbModel[]> {
    const experienceSessionRef = ExperienceSessionRepository.getRefById(
      this.firestore,
      experienceSessionId
    )

    const studentAbilityUsagesQuery = query(
      this.getCollectionRef(),
      where('experienceSession', '==', experienceSessionRef),
      orderBy('usageAt', 'desc')
    ) as Query<StudentAbilityUsageDbModel>

    return collectionData<StudentAbilityUsageDbModel>(
      studentAbilityUsagesQuery,
      { idField: 'id' }
    )
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, StudentAbilityUsageRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${StudentAbilityUsageRepository.collectionName}/${id}`)
  }
}
