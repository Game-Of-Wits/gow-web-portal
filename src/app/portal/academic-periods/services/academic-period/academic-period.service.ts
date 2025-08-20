import { Injectable, inject } from '@angular/core'
import { FirestoreError, Timestamp } from '@angular/fire/firestore'
import { ErrorCode } from '@shared/types/ErrorCode'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { map, Observable, take } from 'rxjs'
import { AcademicPeriodMapper } from '~/academic-periods/mappers/academic-period.mapper'
import type { AcademicPeriodModel } from '~/academic-periods/models/AcademicPeriod.model'
import type { CreateAcademicPeriod } from '~/academic-periods/models/CreateAcademicPeriod.model'
import { AcademicPeriodRespository } from '~/academic-periods/repositories/academic-period.repository'
import { SchoolRepository } from '~/schools/repositories/school.repository'

@Injectable({ providedIn: 'root' })
export class AcademicPeriodService {
  private readonly academicPeriodRepository = inject(AcademicPeriodRespository)
  private readonly schoolRepository = inject(SchoolRepository)

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

  public async endOfAcademicPeriod(
    activeAcademicPeriodId: string
  ): Promise<void> {
    let academicPeriodExists: boolean
    try {
      academicPeriodExists = await this.academicPeriodRepository.existsById(
        activeAcademicPeriodId
      )
    } catch (err) {
      const error = err as ErrorResponse
      throw new ErrorResponse(error.code)
    }

    if (!academicPeriodExists)
      throw new ErrorResponse('academic-period-not-exist')

    try {
      await this.academicPeriodRepository.updateById(activeAcademicPeriodId, {
        endedAt: Timestamp.fromDate(new Date())
      })
    } catch (err) {
      const error = err as ErrorResponse

      if (error.code === ErrorCode.NotFound)
        throw new ErrorResponse('academic-period-not-exist')

      throw new ErrorResponse(error.code)
    }
  }

  public async startNewAcademicPeriod(
    data: CreateAcademicPeriod
  ): Promise<AcademicPeriodModel> {
    let activeAcademicPeriodExists: boolean

    try {
      activeAcademicPeriodExists =
        await this.academicPeriodRepository.existsSchoolActiveAcademicPeriod(
          data.schoolId
        )
    } catch (err) {
      const error = err as FirestoreError
      throw new ErrorResponse(error.code)
    }

    if (activeAcademicPeriodExists)
      throw new ErrorResponse('academic-period-exist')

    try {
      const newAcademicPeriod = await this.academicPeriodRepository.create(data)
      return AcademicPeriodMapper.toModel(newAcademicPeriod)
    } catch (err) {
      const error = err as ErrorResponse
      throw new ErrorResponse(error.code)
    }
  }
}
