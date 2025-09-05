import { Injectable, inject } from '@angular/core'
import {
  collection,
  DocumentReference,
  doc,
  Firestore,
  getDocs,
  limit,
  query,
  where
} from '@angular/fire/firestore'
import { EliminatedStudentDbModel } from '../models/EliminatedStudentDb.model'
import { StudentPeriodStateRepository } from './student-period-state.repository'

@Injectable({ providedIn: 'root' })
export class EliminatedStudentRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'eliminated_students'
  private readonly collectionName = EliminatedStudentRepository.collectionName

  public async getByStudentPeriodStateId(
    studentPeriodStateId: string
  ): Promise<EliminatedStudentDbModel | null> {
    const studentPeriodStateRef = StudentPeriodStateRepository.getRefById(
      this.firestore,
      studentPeriodStateId
    )

    const eliminatedStudentQuery = query(
      this.getCollectionRef(),
      where('studentState', '==', studentPeriodStateRef),
      limit(1)
    )

    const eliminatedStudentSnapshot = await getDocs(eliminatedStudentQuery)

    if (eliminatedStudentSnapshot.empty) return null

    const eliminatedStudent = eliminatedStudentSnapshot.docs[0]

    return {
      ...eliminatedStudent.data(),
      id: eliminatedStudent.id
    } as EliminatedStudentDbModel
  }

  public async existByStudentPeriodStateId(
    studentPeriodStateId: string
  ): Promise<boolean> {
    const studentPeriodStateRef = StudentPeriodStateRepository.getRefById(
      this.firestore,
      studentPeriodStateId
    )

    const eliminatedStudentQuery = query(
      this.getCollectionRef(),
      where('studentState', '==', studentPeriodStateRef)
    )

    const eliminatedStudentSnapshot = await getDocs(eliminatedStudentQuery)

    return !eliminatedStudentSnapshot.empty
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static generateRef(db: Firestore): DocumentReference {
    return doc(EliminatedStudentRepository.getCollectionRef(db))
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, EliminatedStudentRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${EliminatedStudentRepository.collectionName}/${id}`)
  }
}
