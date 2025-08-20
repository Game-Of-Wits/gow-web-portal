import { Injectable, inject } from '@angular/core'
import { FirestoreError } from '@angular/fire/firestore'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { catchError, Observable, switchMap, throwError } from 'rxjs'
import { StudentPeriodStateMapper } from '~/students/mappers/student-period-state.mapper'
import { MasteryRoadStudentPeriodState } from '~/students/models/MasteryRoadStudentPeriodState'
import { ShadowWarfareStudentPeriodState } from '~/students/models/ShadowWarfareStudentPeriodState'
import { StudentPeriodStatesModel } from '~/students/models/StudentPeriodStates.model'
import { StudentRepository } from '~/students/repositories/student.repository'
import { StudentPeriodStateRepository } from '~/students/repositories/student-period-state.repository'

@Injectable({ providedIn: 'root' })
export class StudentPeriodStateService {
  private readonly studentPeriodStateRepository = inject(
    StudentPeriodStateRepository
  )
  private readonly studentRepository = inject(StudentRepository)
  private readonly studentPeriodStateMapper = inject(StudentPeriodStateMapper)

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
}
