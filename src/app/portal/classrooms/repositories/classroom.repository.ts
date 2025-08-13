import { Injectable, inject } from '@angular/core'
import {
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  getDoc,
  Query,
  query,
  where
} from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { TeacherRepository } from '~/teacher-profile/repositories/teacher.repository'
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
    return docData(classroomRef, {
      idField: 'id'
    }) as Observable<ClassroomDbModel>
  }

  public async getById(classroomId: string): Promise<ClassroomDbModel | null> {
    const snapshot = await getDoc(this.getClassroomRefById(classroomId))

    if (!snapshot.exists()) return null

    return {
      id: snapshot.id,
      ...(snapshot.data() as ClassroomDbWithoutId)
    }
  }

  public async existsById(id: string) {
    const snapshot = await getDoc(this.getClassroomRefById(id))
    return snapshot.exists()
  }

  public getAllClassrooms(teacherId: string): Observable<ClassroomDbModel[]> {
    const teacherRef = TeacherRepository.getTeacherRefById(
      this.firestore,
      teacherId
    )

    const classroomsQuery = query(
      this.getClassroomsRef(),
      where('teacher', '==', teacherRef)
    ) as Query<ClassroomDbModel>

    return collectionData<ClassroomDbModel>(classroomsQuery, { idField: 'id' })
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
