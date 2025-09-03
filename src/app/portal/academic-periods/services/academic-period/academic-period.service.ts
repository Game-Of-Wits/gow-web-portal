import { Injectable, inject } from '@angular/core'
import { FirestoreError } from '@angular/fire/firestore'
import { Functions, httpsCallable } from '@angular/fire/functions'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { catchError, map, Observable, take, throwError } from 'rxjs'
import { AcademicPeriodMapper } from '~/academic-periods/mappers/academic-period.mapper'
import type { AcademicPeriodModel } from '~/academic-periods/models/AcademicPeriod.model'
import type { CreateAcademicPeriod } from '~/academic-periods/models/CreateAcademicPeriod.model'
import { AcademicPeriodRespository } from '~/academic-periods/repositories/academic-period.repository'
import { SchoolRepository } from '~/schools/repositories/school.repository'

@Injectable({ providedIn: 'root' })
export class AcademicPeriodService {
  private readonly academicPeriodRepository = inject(AcademicPeriodRespository)
  private readonly schoolRepository = inject(SchoolRepository)

  private readonly cloudFunctions = inject(Functions)

  public getSchoolActiveAcademicPeriod(
    schoolId: string
  ): Observable<AcademicPeriodModel> {
    return this.academicPeriodRepository
      .getSchoolActiveAcademicPeriod(schoolId)
      .pipe(
        take(1),
        map(academicPeriods => {
          if (academicPeriods[0] === null || academicPeriods[0] === undefined)
            throw new ErrorResponse('active-academic-period-not-exist')
          return AcademicPeriodMapper.toModel(academicPeriods[0])
        }),
        catchError(err => {
          if (err instanceof FirestoreError)
            return throwError(() => new ErrorResponse(err.code))
          return throwError(() => err)
        })
      )
  }

  public async getAllAcademicPeriodsBySchool(
    schoolId: string
  ): Promise<AcademicPeriodModel[]> {
    try {
      const schoolExist = await this.schoolRepository.existById(schoolId)
      if (!schoolExist) throw new ErrorResponse('school-not-exist')

      const academicPeriods =
        await this.academicPeriodRepository.getAllBySchoolId(schoolId)

      const academicPeriodsMapped =
        AcademicPeriodMapper.toListModel(academicPeriods)

      return academicPeriodsMapped.sort(
        (a, b) => b.startedAt.getTime() - a.startedAt.getTime()
      )
    } catch (err) {
      const error = err as FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public async verifySchoolHasActiveAcademicPeriod(
    schoolId: string
  ): Promise<boolean> {
    try {
      return this.academicPeriodRepository.existsSchoolActiveAcademicPeriod(
        schoolId
      )
    } catch (err) {
      const error = err as FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public async verifyAcademicPeriodIsActive(
    academicPeriodId: string
  ): Promise<boolean> {
    try {
      const academicPeriod =
        await this.academicPeriodRepository.getByIdAsync(academicPeriodId)
      return academicPeriod?.endedAt === null
    } catch (err) {
      const error = err as FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public async endOfAcademicPeriod(schoolId: string): Promise<void> {
    try {
      const endOfAcademicPeriodFn = httpsCallable(
        this.cloudFunctions,
        'endAcademicPeriod'
      )

      await endOfAcademicPeriodFn({ schoolId })
    } catch (err: any) {
      throw new ErrorResponse(err.code, err.message)
    }
  }

  public async startNewAcademicPeriod(
    data: CreateAcademicPeriod
  ): Promise<AcademicPeriodModel> {
    try {
      const startAcademicPeriodFn = httpsCallable(
        this.cloudFunctions,
        'startAcademicPeriod'
      )

      const result = await startAcademicPeriodFn(data)

      return result.data as AcademicPeriodModel
    } catch (err: any) {
      throw new ErrorResponse(err.code, err.message)
    }
  }
}
