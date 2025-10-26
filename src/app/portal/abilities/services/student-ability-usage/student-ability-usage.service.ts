import { Injectable, inject } from '@angular/core'
import { FirestoreError } from '@angular/fire/firestore'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import {
  catchError,
  from,
  Observable,
  shareReplay,
  switchMap,
  throwError
} from 'rxjs'
import { StudentAbilityUsageMapper } from '~/abilities/mappers/student-ability-usage.mapper'
import { StudentAbilityUsageModel } from '~/abilities/models/StudentAbilityUsage.model'
import { StudentAbilityUsageRepository } from '~/abilities/repositories/student-ability-usage.repository'

@Injectable({ providedIn: 'root' })
export class StudentAbilityUsageService {
  private readonly studentAbilityUsageRepository = inject(
    StudentAbilityUsageRepository
  )

  public watchByExperienceSession(
    experienceSessionId: string
  ): Observable<StudentAbilityUsageModel[]> {
    return this.studentAbilityUsageRepository
      .getAllByExperienceSessionId(experienceSessionId)
      .pipe(
        switchMap(dbList =>
          from(StudentAbilityUsageMapper.toListModel(dbList))
        ),
        catchError(err => {
          if (err instanceof FirestoreError)
            return throwError(() => new ErrorResponse(err.code))

          return throwError(() => err)
        }),
        shareReplay({ bufferSize: 1, refCount: true })
      )
  }
}
