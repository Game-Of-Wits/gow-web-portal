import { Injectable, inject } from '@angular/core'
import { FirestoreError } from '@angular/fire/firestore'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { StudentHomeworkMapper } from '~/homeworks/mappers/student-homework.mapper'
import { StudentHomeworkModel } from '~/homeworks/models/StudentHomework.model'
import { StudentHomeworkRepository } from '~/homeworks/repositories/student-homework.repository'

@Injectable({ providedIn: 'root' })
export class StudentHomeworkService {
  private readonly studentHomeworkRepository = inject(StudentHomeworkRepository)

  public async getStudentHomeworksByStudentPeriodStateId(
    studentPeriodStateId: string
  ): Promise<StudentHomeworkModel[]> {
    try {
      const studentHomeworks =
        await this.studentHomeworkRepository.getAllByStudentPeriodStateId(
          studentPeriodStateId
        )
      return StudentHomeworkMapper.toList(studentHomeworks)
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }
}
