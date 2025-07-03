import { Injectable, inject } from '@angular/core'
import {
  collection,
  collectionData,
  doc,
  Firestore,
  Query,
  query,
  where
} from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { TeacherRepository } from '~/teacher-profile/repositories/teacher.repository'
import type { ClassroomDbModel } from '../models/ClassroomDb.model'

@Injectable({ providedIn: 'root' })
export class ClassroomRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'classrooms'
  private readonly collectionName = ClassroomRepository.collectionName

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

  private getClassroomsRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getClassroomRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }
}
