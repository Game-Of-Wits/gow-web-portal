import { Injectable, inject } from '@angular/core'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { StudentProfileMapper } from '~/student-profiles/mappers/student-profile.mapper'
import { StudentProfileModel } from '~/student-profiles/models/StudentProfile.model'
import { StudentProfileRepository } from '~/student-profiles/repositories/student-profile.repository'

@Injectable({ providedIn: 'root' })
export class StudentProfileService {
  private readonly studentProfileRepository = inject(StudentProfileRepository)

  public async getStudentProfileByIdAsync(
    studentProfileId: string
  ): Promise<StudentProfileModel> {
    const studentProfile =
      await this.studentProfileRepository.getByIdAsync(studentProfileId)
    if (studentProfile === null)
      throw new ErrorResponse('student-profile-not-exist')
    return StudentProfileMapper.toModel(studentProfile)
  }
}
