import { Injectable, inject } from '@angular/core'
import { FirestoreError } from '@angular/fire/firestore'
import { ErrorCode } from '@shared/types/ErrorCode'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { map, Observable } from 'rxjs'
import { ClassroomMapper } from '~/classrooms/mappers/classroom.mapper'
import type { ClassroomModel } from '~/classrooms/models/Classroom.model'
import { CreateClassroomModel } from '~/classrooms/models/CreateClassroom.model'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { AuthStore } from '~/shared/store/auth.store'

@Injectable({ providedIn: 'root' })
export class ClassroomsService {
  private readonly classroomRepository = inject(ClassroomRepository)
  private readonly authStore = inject(AuthStore)

  public getClassroomById(classroomId: string): Observable<ClassroomModel> {
    return this.classroomRepository
      .getClassroomById(classroomId)
      .pipe(map(classroom => ClassroomMapper.toModel(classroom)))
  }

  public async getClassroomByIdAsync(
    classroomId: string
  ): Promise<ClassroomModel | null> {
    try {
      const classroomDb = await this.classroomRepository.getById(classroomId)
      return classroomDb !== null ? ClassroomMapper.toModel(classroomDb) : null
    } catch (err) {
      const error = err as FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public getAllClassrooms(): Observable<ClassroomModel[]> {
    if (!this.authStore.isAuth())
      throw new ErrorResponse(ErrorCode.Unauthenticated)

    const authUser = this.authStore.authUser()!

    return this.classroomRepository
      .getAllClassrooms(authUser.id)
      .pipe(map(classsroom => ClassroomMapper.toListModels(classsroom)))
  }

  public async createClassroom(data: CreateClassroomModel): Promise<void> {}
}
