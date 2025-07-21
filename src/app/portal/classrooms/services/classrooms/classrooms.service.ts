import { Injectable, inject } from '@angular/core'
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

  public getAllClassrooms(): Observable<ClassroomModel[]> {
    if (!this.authStore.isAuth())
      throw new ErrorResponse(ErrorCode.Unauthenticated)

    const authUser = this.authStore.authUser()!

    return this.classroomRepository
      .getAllClassrooms(authUser.id)
      .pipe(map(classsroom => ClassroomMapper.toListModels(classsroom)))
  }

  public async createClassroom(data: CreateClassroomModel): Promise<void> {
    console.log(data)
  }
}
