import { Injectable, inject } from '@angular/core'
import { FirestoreError } from '@angular/fire/firestore'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { catchError, Observable, switchMap, throwError } from 'rxjs'
import { StudentPeriodStateMapper } from '~/students/mappers/student-period-state.mapper'
import { MasteryRoadStudentPeriodState } from '~/students/models/MasteryRoadStudentPeriodState'
import { ShadowWarfareStudentPeriodState } from '~/students/models/ShadowWarfareStudentPeriodState'
import { StudentPeriodStateRepository } from '~/students/repositories/student-period-state.repository'

@Injectable({ providedIn: 'root' })
export class StudentPeriodStateService {
  private readonly studentPeriodStateRepository = inject(
    StudentPeriodStateRepository
  )

  private readonly studentPeriodStateMapper = inject(StudentPeriodStateMapper)

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
