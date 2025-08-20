import { Injectable, inject } from '@angular/core'
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  where
} from '@angular/fire/firestore'
import { from, map, Observable } from 'rxjs'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { StudentProfileDbModel } from '../models/StudentProfileDb.model'

@Injectable({ providedIn: 'root' })
export class StudentProfileRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'student_profiles'
  private readonly collectionName = StudentProfileRepository.collectionName

  public async getByIdAsync(id: string): Promise<StudentProfileDbModel | null> {
    const studentProfileRef = this.getRefById(id)
    const studentProfileSnapshot = await getDoc(studentProfileRef)

    if (!studentProfileSnapshot.exists()) return null

    return {
      id: studentProfileSnapshot.id,
      ...studentProfileSnapshot.data()
    } as StudentProfileDbModel
  }

  public getAllByClassroomId(
    classroomId: string
  ): Observable<StudentProfileDbModel[]> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      classroomId
    )

    const studentsQuery = query(
      this.getCollectionRef(),
      where('classrooms', 'array-contains', classroomRef)
    )

    return from(getDocs(studentsQuery)).pipe(
      map(snapshot =>
        snapshot.docs.map(
          doc =>
            ({
              id: doc.id,
              ...doc.data()
            }) as StudentProfileDbModel
        )
      )
    )
  }

  public async existById(id: string): Promise<boolean> {
    const studentProfileRef = this.getRefById(id)
    const studentProfileSnapshot = await getDoc(studentProfileRef)
    return studentProfileSnapshot.exists()
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, StudentProfileRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${StudentProfileRepository.collectionName}/${id}`)
  }
}
