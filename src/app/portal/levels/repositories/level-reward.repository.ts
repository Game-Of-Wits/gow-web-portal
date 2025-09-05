import { Injectable, inject } from '@angular/core'
import {
  collection,
  doc,
  Firestore,
  getDocs,
  query,
  where
} from '@angular/fire/firestore'
import { StudentPeriodStateRepository } from '~/students/repositories/student-period-state.repository'
import { LevelRewardDbModel } from '../models/LevelRewardDb.model'

@Injectable({ providedIn: 'root' })
export class LevelRewardRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'level_rewards'
  private readonly collectionName = LevelRewardRepository.collectionName

  public async getAllByStudentPeriodStateIdAsync(
    studentPeriodStateId: string
  ): Promise<LevelRewardDbModel[]> {
    const studentPeriodStateRef = StudentPeriodStateRepository.getRefById(
      this.firestore,
      studentPeriodStateId
    )

    const levelRewardsQuery = query(
      this.getCollectionRef(),
      where('studentState', '==', studentPeriodStateRef)
    )

    const levelRewardsSnapshot = await getDocs(levelRewardsQuery)

    return levelRewardsSnapshot.docs.map(
      doc => ({ ...doc.data(), id: doc.id }) as LevelRewardDbModel
    )
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static generateRef(db: Firestore) {
    return doc(this.getCollectionRef(db))
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, LevelRewardRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${LevelRewardRepository.collectionName}/${id}`)
  }
}
