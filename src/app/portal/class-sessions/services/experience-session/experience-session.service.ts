import { Injectable, inject } from '@angular/core'
import {
  FirestoreError,
  serverTimestamp,
  Timestamp
} from '@angular/fire/firestore'
import { ErrorCode } from '@shared/types/ErrorCode'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { map, Observable, take } from 'rxjs'
import { ExperienceSessionMapper } from '~/class-sessions/mappers/experience-session.mapper'
import { CreateExperienceSession } from '~/class-sessions/models/CreateExperienceSession.model'
import { ExperienceSessionModel } from '~/class-sessions/models/ExperienceSession.model'
import { ClassSessionRepository } from '~/class-sessions/repositories/class-session.repository'
import { ExperienceSessionRepository } from '~/class-sessions/repositories/experience-session.repository'
import { AuthStore } from '~/shared/store/auth.store'

@Injectable({ providedIn: 'root' })
export class ExperienceSessionService {
  private readonly classSessionRepository = inject(ClassSessionRepository)
  private readonly experienceSessionRepository = inject(
    ExperienceSessionRepository
  )

  private readonly authStore = inject(AuthStore)

  public getActiveExperienceSession(
    classSessionId: string
  ): Observable<ExperienceSessionModel> {
    if (!this.authStore.isAuth())
      throw new ErrorResponse(ErrorCode.Unauthenticated)

    return this.experienceSessionRepository
      .getActiveExperienceSessions(classSessionId)
      .pipe(
        take(1),
        map(experienceSessions => {
          if (
            experienceSessions[0] === null ||
            experienceSessions[0] === undefined
          )
            throw new ErrorResponse('active-experience-session-not-exist')

          return ExperienceSessionMapper.toModel(experienceSessions[0])
        })
      )
  }

  public async verifyClassSessionHasActiveExperienceSession(
    classSessionId: string
  ): Promise<boolean> {
    if (!this.authStore.isAuth())
      throw new ErrorResponse(ErrorCode.Unauthenticated)

    try {
      return this.experienceSessionRepository.existsActiveExperienceSessionByClassSessionId(
        classSessionId
      )
    } catch (err) {
      const error = err as FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public async endOfExperienceSession(
    experienceSessionId: string
  ): Promise<void> {
    try {
      if (!this.authStore.isAuth())
        throw new ErrorResponse(ErrorCode.Unauthenticated)

      const activeExperienceSessionExists =
        await this.experienceSessionRepository.existsActiveExperienceSessionById(
          experienceSessionId
        )

      if (!activeExperienceSessionExists)
        throw new ErrorResponse('experience-session-not-active')

      await this.experienceSessionRepository.updateById(experienceSessionId, {
        endedAt: serverTimestamp()
      })
    } catch (err) {
      const error = err as FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public async startNewExperienceSession(
    data: CreateExperienceSession
  ): Promise<ExperienceSessionModel> {
    try {
      if (!this.authStore.isAuth())
        throw new ErrorResponse(ErrorCode.Unauthenticated)

      const isActiveClassSession =
        await this.classSessionRepository.existsActiveClassSessionById(
          data.classSessionId
        )

      if (!isActiveClassSession)
        throw new ErrorResponse('class-session-not-active')

      const activeExperienceSessionExists =
        await this.experienceSessionRepository.existsActiveExperienceSessionByClassSessionId(
          data.classSessionId
        )

      if (activeExperienceSessionExists)
        throw new ErrorResponse('active-experience-session-exist')

      const experienceSessionDb =
        await this.experienceSessionRepository.create(data)

      return ExperienceSessionMapper.toModel(experienceSessionDb)
    } catch (err) {
      const error = err as FirestoreError
      throw new ErrorResponse(error.code)
    }
  }
}
