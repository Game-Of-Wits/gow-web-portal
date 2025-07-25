import { Injectable, inject } from '@angular/core'
import {
  collection,
  DocumentReference,
  doc,
  Firestore,
  getDoc,
  query,
  where
} from '@angular/fire/firestore'
import { StudentDbModel } from '../models/StudentDb.model'

@Injectable({ providedIn: 'root' })
export class StudentRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'students'
  private readonly collectionName = StudentRepository.collectionName

  public async getByIdAsync(studentId: string): Promise<StudentDbModel | null> {
    const studentRef = this.getRefById(studentId)
    const studentSnapshot = await getDoc(studentRef)

    if (!studentSnapshot.exists()) return null

    return {
      id: studentSnapshot.id,
      ...studentSnapshot.data()
    } as StudentDbModel
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, StudentRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${StudentRepository.collectionName}/${id}`)
  }

  public static queryAllByClassroomRef(
    db: Firestore,
    classroomRef: DocumentReference
  ) {
    return query(
      StudentRepository.getCollectionRef(db),
      where('classroom', '==', classroomRef)
    )
  }
}
