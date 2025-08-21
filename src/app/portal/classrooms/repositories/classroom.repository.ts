import { Injectable, inject } from '@angular/core'
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  Query,
  query,
  where
} from '@angular/fire/firestore'
import { from, map, Observable } from 'rxjs'
import { TeacherProfileRepository } from '~/teacher-profile/repositories/teacher.repository'
import type {
  ClassroomDbModel,
  ClassroomDbWithoutId
} from '../models/ClassroomDb.model'

@Injectable({ providedIn: 'root' })
export class ClassroomRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'classrooms'
  private readonly collectionName = ClassroomRepository.collectionName

  public getClassroomById(classroomId: string): Observable<ClassroomDbModel> {
    const classroomRef = this.getClassroomRefById(classroomId)

    return from(getDoc(classroomRef)).pipe(
      map(
        snapshot =>
          ({ ...snapshot.data(), id: snapshot.id }) as ClassroomDbModel
      )
    )
  }

  public async getById(classroomId: string): Promise<ClassroomDbModel | null> {
    const snapshot = await getDoc(this.getClassroomRefById(classroomId))

    if (!snapshot.exists()) return null

    return {
      id: snapshot.id,
      ...(snapshot.data() as ClassroomDbWithoutId)
    }
  }

  public async existById(id: string) {
    const snapshot = await getDoc(this.getClassroomRefById(id))
    return snapshot.exists()
  }

  public getAllClassrooms(teacherId: string): Observable<ClassroomDbModel[]> {
    const teacherRef = TeacherProfileRepository.getRefById(
      this.firestore,
      teacherId
    )

    const classroomsQuery = query(
      this.getClassroomsRef(),
      where('teacher', '==', teacherRef)
    ) as Query<ClassroomDbModel>

    return from(getDocs(classroomsQuery)).pipe(
      map(snapshot => {
        return snapshot.docs.map(
          doc => ({ ...doc.data(), id: doc.id }) as ClassroomDbModel
        )
      })
    )
  }

  public getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  private getClassroomsRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getClassroomRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${ClassroomRepository.collectionName}/${id}`)
  }
}
