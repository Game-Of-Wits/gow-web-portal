import { Injectable, inject } from '@angular/core'
import { FirestoreError } from '@angular/fire/firestore'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { catchError, firstValueFrom, map, Observable, switchMap, throwError } from 'rxjs'
import { ExperienceSessionRepository } from '~/class-sessions/repositories/experience-session.repository'
import { PenaltyRepository } from '~/penalties/repositories/penalty.repository'
import { PointsModifier } from '~/shared/models/PointsModifier'
import { StudentPeriodStateMapper } from '~/students/mappers/student-period-state.mapper'
import { MasteryRoadStudentPeriodState } from '~/students/models/MasteryRoadStudentPeriodState'
import { ShadowWarfareStudentPeriodState } from '~/students/models/ShadowWarfareStudentPeriodState'
import { StudentPeriodStatesModel } from '~/students/models/StudentPeriodStates.model'
import { EliminatedStudentRepository } from '~/students/repositories/eliminated-student.repository'
import { StudentRepository } from '~/students/repositories/student.repository'
import { StudentPeriodStateRepository } from '~/students/repositories/student-period-state.repository'
import { MasteryRoadStudentPeriodStateOnlyStats } from '~/students/models/MasteryRoadStudentPeriodStateOnlyStats'
import { calcMasteryRoadStudentPeriodStatesRanking } from '~/students/utils/calcMasteryRoadStudentPeriodStatesRanking'
import { MasteryRoadStudentPeriodStateRanking } from '~/students/models/MasteryRoadStudentPeriodStateRanking'

@Injectable({ providedIn: 'root' })
export class StudentPeriodStateService {
  private readonly studentPeriodStateRepository = inject(
    StudentPeriodStateRepository
  )
  private readonly studentRepository = inject(StudentRepository)
  private readonly studentPeriodStateMapper = inject(StudentPeriodStateMapper)
  private readonly penaltyRepository = inject(PenaltyRepository)
  private readonly experienceSessionRepository = inject(
    ExperienceSessionRepository
  )
  private readonly eliminatedStudentRepository = inject(
    EliminatedStudentRepository
  )

  public async getAllStudentPeriodStatesByStudentProfileId(
    studentProfileId: string
  ): Promise<StudentPeriodStatesModel[]> {
    try {
      const student =
        await this.studentRepository.getByProfileIdAsync(studentProfileId)

      if (student === null) throw new ErrorResponse('student-not-exist')

      const studentPeriodStates =
        await this.studentPeriodStateRepository.getAllByStudentId(student.id)

      return this.studentPeriodStateMapper.toListModel(studentPeriodStates)
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public async getMasteryRoadStudentPeriodStateRankingById(studentPeriodStateId: string): Promise<MasteryRoadStudentPeriodStateRanking<MasteryRoadStudentPeriodStateOnlyStats> | null> {
    try {
      const studentPeriodState = await this.studentPeriodStateRepository.getByIdAsync(studentPeriodStateId)

      if (studentPeriodState === null) throw new ErrorResponse('student-period-not-exist')

      const studentPeriodStatesStats = await firstValueFrom(
        this.getAllMasteryRoadStudentPeriodStatesOnlyStats({
          classroomId: studentPeriodState.classroom.id,
          academicPeriodId: studentPeriodState.academicPeriod.id
        })
      )

      const studentsStatsRanking = calcMasteryRoadStudentPeriodStatesRanking(studentPeriodStatesStats)

      const studentRanking = studentsStatsRanking.find(studentRanking => studentRanking.state.id === studentPeriodStateId)

      return studentRanking ?? null
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public getAllMasteryRoadStudentPeriodStates({
    classroomId,
    academicPeriodId
  }: {
    classroomId: string
    academicPeriodId: string
  }): Observable<MasteryRoadStudentPeriodState[]> {
    return this.studentPeriodStateRepository
      .getAllByClassroomIdAndExperienceSession({
        classroomId,
        academicPeriodId
      })
      .pipe(
        switchMap(students =>
          this.studentPeriodStateMapper.onlyMasteryRoadExperienceList(students)
        ),
        catchError(err => {
          if (err instanceof FirestoreError)
            return throwError(() => new ErrorResponse(err.code))
          return throwError(() => err)
        })
      )
  }

  public getAllMasteryRoadStudentPeriodStatesOnlyStats({
    classroomId,
    academicPeriodId
  }: {
    classroomId: string
    academicPeriodId: string
  }): Observable<MasteryRoadStudentPeriodStateOnlyStats[]> {
    return this.studentPeriodStateRepository
      .getAllByClassroomIdAndExperienceSession({
        classroomId,
        academicPeriodId
      })
      .pipe(
        map(students =>
          this.studentPeriodStateMapper.onlyMasteryRoadExperienceStatsList(students)
        ),
        catchError(err => {
          if (err instanceof FirestoreError)
            return throwError(() => new ErrorResponse(err.code))
          return throwError(() => err)
        })
      )
  }

  public getAllShadowWarfareStudentPeriodStates({
    classroomId,
    academicPeriodId
  }: {
    classroomId: string
    academicPeriodId: string
  }): Observable<ShadowWarfareStudentPeriodState[]> {
    return this.studentPeriodStateRepository
      .getAllByClassroomIdAndExperienceSession({
        classroomId,
        academicPeriodId
      })
      .pipe(
        switchMap(students =>
          this.studentPeriodStateMapper.onlyShadowWarfareExperienceList(
            students
          )
        ),
        catchError(err => {
          if (err instanceof FirestoreError)
            return throwError(() => new ErrorResponse(err.code))
          return throwError(() => err)
        })
      )
  }

  public async modifyStudentHealthPoints(
    studentPeriodStateId: string,
    data: {
      modifier: PointsModifier
      points: number
    }
  ): Promise<number> {
    try {
      const studentPeriodState =
        await this.studentPeriodStateRepository.getByIdAsync(
          studentPeriodStateId
        )
      if (studentPeriodState === null)
        throw new ErrorResponse('student-period-state-not-exist')

      if (data.points <= 0) throw new ErrorResponse('points-must-be-positive')

      return await this.studentPeriodStateRepository.modifyStudentHealthPoints(
        studentPeriodState,
        data
      )
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public async eliminateStudentByVotes(
    studentPeriodStateId: string,
    votes: number
  ): Promise<void> {
    try {
      const studentPeriodState =
        await this.studentPeriodStateRepository.getByIdAsync(
          studentPeriodStateId
        )
      if (studentPeriodState === null)
        throw new ErrorResponse('student-period-state-not-exist')

      if (votes <= 0) throw new ErrorResponse('votes-must-be-positive')

      await this.studentPeriodStateRepository.eliminateStudentByVotes(
        studentPeriodState,
        votes
      )
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public async modifyStudentProgressPoints(
    studentPeriodStateId: string,
    experienceSessionId: string,
    data: { modifier: PointsModifier; points: number }
  ): Promise<{
    newProgressPoints: number
    newLevelId: string
  }> {
    try {
      if (data.points <= 0) throw new ErrorResponse('points-must-be-positive')

      const studentPeriodState =
        await this.studentPeriodStateRepository.getByIdAsync(
          studentPeriodStateId
        )
      if (studentPeriodState === null)
        throw new ErrorResponse('student-period-state-not-exist')

      const experienceSession =
        await this.experienceSessionRepository.getById(experienceSessionId)

      if (experienceSession === null)
        throw new ErrorResponse('experience-session-not-exist')

      if (experienceSession.endedAt !== null)
        throw new ErrorResponse('experience-session-is-not-active')

      return await this.studentPeriodStateRepository.modifyStudentProgressPoints(
        studentPeriodState,
        experienceSession.id,
        data
      )
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public async applyPenaltytoStudentPeriodStateById(
    studentPeriodStateId: string,
    experienceSessionId: string,
    penaltyId: string
  ): Promise<{
    newLevelId: string
    newProgressPoints: number
  }> {
    try {
      const studentPeriodState =
        await this.studentPeriodStateRepository.getByIdAsync(
          studentPeriodStateId
        )
      if (studentPeriodState === null)
        throw new ErrorResponse('student-period-state-not-exist')

      const penalty = await this.penaltyRepository.getByIdAsync(penaltyId)
      if (penalty === null) throw new ErrorResponse('penalty-not-exist')

      const experienceSession =
        await this.experienceSessionRepository.getById(experienceSessionId)

      if (experienceSession === null)
        throw new ErrorResponse('experience-session-not-exist')

      if (experienceSession.endedAt !== null)
        throw new ErrorResponse('experience-session-is-not-active')

      return await this.studentPeriodStateRepository.modifyStudentProgressPoints(
        studentPeriodState,
        experienceSession.id,
        {
          modifier: PointsModifier.DECREASE,
          points: penalty.reducePoints
        }
      )
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public async reviveStudentPeriodState(
    studentPeriodStateId: string
  ): Promise<void> {
    try {
      const studentPeriodState =
        await this.studentPeriodStateRepository.getByIdAsync(
          studentPeriodStateId
        )
      if (studentPeriodState === null)
        throw new ErrorResponse('student-period-state-not-exist')

      const existEliminatedStudent =
        await this.eliminatedStudentRepository.existByStudentPeriodStateId(
          studentPeriodState.id
        )
      if (!existEliminatedStudent) throw new ErrorResponse('student-is-alive')

      await this.studentPeriodStateRepository.reviveStudentPeriodState(
        studentPeriodState.id
      )
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }
}
