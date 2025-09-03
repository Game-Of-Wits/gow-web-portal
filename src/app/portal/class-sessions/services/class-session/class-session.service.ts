import { Injectable, inject } from '@angular/core'
import { FirestoreError, serverTimestamp } from '@angular/fire/firestore'
import { ErrorCode } from '@shared/types/ErrorCode'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { map, Observable, take } from 'rxjs'
import { AcademicPeriodService } from '~/academic-periods/services/academic-period/academic-period.service'
import { ClassSessionMapper } from '~/class-sessions/mappers/class-session.mapper'
import { ClassSessionModel } from '~/class-sessions/models/ClassSession.model'
import { CreateClassSession } from '~/class-sessions/models/CreateClassSession.model'
import { ClassSessionRepository } from '~/class-sessions/repositories/class-session.repository'
import { ClassroomsService } from '~/classrooms/services/classrooms/classrooms.service'
import { AuthStore } from '~/shared/store/auth.store'

@Injectable({ providedIn: 'root' })
export class ClassSessionService {
  private readonly academicPeriodService = inject(AcademicPeriodService)
  private readonly classroomService = inject(ClassroomsService)

  private readonly classSessionRepository = inject(ClassSessionRepository)

  private readonly authStore = inject(AuthStore)

  public getActiveClassSession({
    classroomId,
    academicPeriodId
  }: {
    classroomId: string
    academicPeriodId: string
  }): Observable<ClassSessionModel> {
    if (!this.authStore.isAuth())
      throw new ErrorResponse(ErrorCode.Unauthenticated)

    return this.classSessionRepository
      .getActiveClassSessions({ classroomId, academicPeriodId })
      .pipe(
        take(1),
        map(classSessions => {
          if (classSessions[0] === null || classSessions[0] === undefined)
            throw new ErrorResponse('active-class-session-not-exist')
          return ClassSessionMapper.toModel(classSessions[0])
        })
      )
  }

  public async verifyActiveClassSession({
    classroomId,
    academicPeriodId
  }: {
    classroomId: string
    academicPeriodId: string
  }): Promise<boolean> {
    if (!this.authStore.isAuth())
      throw new ErrorResponse(ErrorCode.Unauthenticated)

    try {
      return this.classSessionRepository.existsActiveClassSession({
        classroomId,
        academicPeriodId
      })
    } catch (err) {
      const error = err as FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public async endOfActiveClassSession(
    activeClassSessionId: string
  ): Promise<void> {
    try {
      if (!this.authStore.isAuth())
        throw new ErrorResponse(ErrorCode.Unauthenticated)

      const activeClassSessionExists =
        await this.classSessionRepository.existsActiveClassSessionById(
          activeClassSessionId
        )

      if (!activeClassSessionExists)
        throw new ErrorResponse('class-session-not-active')

      await this.classSessionRepository.updateById(activeClassSessionId, {
        endedAt: serverTimestamp()
      })
    } catch (err) {
      const error = err as FirestoreError | ErrorResponse
      throw new ErrorResponse(error.code)
    }
  }

  public async startNewClassSession(
    data: CreateClassSession
  ): Promise<ClassSessionModel> {
    try {
      if (!this.authStore.isAuth())
        throw new ErrorResponse(ErrorCode.Unauthenticated)

      const authUserId = this.authStore.authUser()?.id

      const isActiveAcademicPeriod =
        await this.academicPeriodService.verifyAcademicPeriodIsActive(
          data.academicPeriodId
        )

      if (!isActiveAcademicPeriod)
        throw new ErrorResponse('academic-period-not-active')

      const classroom = await this.classroomService.getClassroomByIdAsync(
        data.classroomId
      )

      if (classroom === null) throw new ErrorResponse('classroom-not-exist')

      if (classroom.teacherId !== authUserId)
        throw new ErrorResponse('classroom-not-owned')

      const activeClassSessionExists =
        await this.classSessionRepository.existsActiveClassSession({
          classroomId: classroom.id,
          academicPeriodId: data.academicPeriodId
        })

      if (activeClassSessionExists)
        throw new ErrorResponse('active-class-session-exist')

      const classSessionDb = await this.classSessionRepository.create(data)

      return ClassSessionMapper.toModel(classSessionDb)
    } catch (err) {
      const error = err as FirestoreError | ErrorResponse
      throw new ErrorResponse(error.code)
    }
  }
}
