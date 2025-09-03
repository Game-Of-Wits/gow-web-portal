import { Injectable, inject } from '@angular/core'
import { FirestoreError } from '@angular/fire/firestore'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { catchError, map, Observable, throwError } from 'rxjs'
import { StudentProfileMapper } from '~/student-profiles/mappers/student-profile.mapper'
import { StudentProfileModel } from '~/student-profiles/models/StudentProfile.model'
import { StudentProfileRepository } from '~/student-profiles/repositories/student-profile.repository'

@Injectable({ providedIn: 'root' })
export class StudentProfileService {
  private readonly studentProfileRepository = inject(StudentProfileRepository)

  public async getStudentProfileByIdAsync(
    studentProfileId: string
  ): Promise<StudentProfileModel> {
    try {
      const studentProfile =
        await this.studentProfileRepository.getByIdAsync(studentProfileId)

      if (studentProfile === null)
        throw new ErrorResponse('student-profile-not-exist')

      return StudentProfileMapper.toModel(studentProfile)
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public getAllStudentProfilesByClassroomId(
    classroomId: string
  ): Observable<StudentProfileModel[]> {
    return this.studentProfileRepository.getAllByClassroomId(classroomId).pipe(
      map(profiles => StudentProfileMapper.toListModel(profiles)),
      catchError(err => {
        if (err instanceof FirestoreError)
          return throwError(() => new ErrorResponse(err.code))
        return throwError(() => err)
      })
    )
  }
}
