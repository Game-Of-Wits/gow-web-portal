import { Injectable, inject } from '@angular/core'
import { FirestoreError } from '@angular/fire/firestore'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { catchError, Observable, switchMap, throwError } from 'rxjs'
import { PenaltyRepository } from '~/penalties/repositories/penalty.repository'
import { PointsModifier } from '~/shared/models/PointsModifier'
import { StudentPeriodStateMapper } from '~/students/mappers/student-period-state.mapper'
import { MasteryRoadStudentPeriodState } from '~/students/models/MasteryRoadStudentPeriodState'
import { ShadowWarfareStudentPeriodState } from '~/students/models/ShadowWarfareStudentPeriodState'
import { StudentPeriodStatesModel } from '~/students/models/StudentPeriodStates.model'
import { EliminatedStudentRepository } from '~/students/repositories/eliminated-student.repository'
import { StudentRepository } from '~/students/repositories/student.repository'
import { StudentPeriodStateRepository } from '~/students/repositories/student-period-state.repository'

@Injectable({ providedIn: 'root' })
export class StudentPeriodStateService {
  private readonly studentPeriodStateRepository = inject(
    StudentPeriodStateRepository
  )
  private readonly studentRepository = inject(StudentRepository)
  private readonly studentPeriodStateMapper = inject(StudentPeriodStateMapper)
  private readonly penaltyRepository = inject(PenaltyRepository)
  private readonly eliminatedStudentRepository = inject(
    EliminatedStudentRepository
  )

  public async getAllStudentPeriodStatesByStudentId(
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

      return await this.studentPeriodStateRepository.modifyStudentHealtPoints(
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
    data: { modifier: PointsModifier; points: number }
  ): Promise<{
    newProgressPoints: number
    newLevelId: string
  }> {
    try {
      const studentPeriodState =
        await this.studentPeriodStateRepository.getByIdAsync(
          studentPeriodStateId
        )
      if (studentPeriodState === null)
        throw new ErrorResponse('student-period-state-not-exist')

      if (data.points <= 0) throw new ErrorResponse('points-must-be-positive')

      return await this.studentPeriodStateRepository.modifyStudentProgressPoints(
        studentPeriodState,
        data
      )
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public async applyPenaltytoStudentPeriodStateById(
    studentPeriodStateId: string,
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

      return await this.studentPeriodStateRepository.modifyStudentProgressPoints(
        studentPeriodState,
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
