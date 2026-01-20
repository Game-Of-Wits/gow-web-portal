import { Injectable, inject } from '@angular/core'
import { FirestoreError } from '@angular/fire/firestore'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { TeacherProfileMapper } from '~/teacher-profile/mappers/teacher-profile.mapper'
import { TeacherProfileModel } from '~/teacher-profile/models/TeacherProfile.model'
import { TeacherProfileRepository } from '~/teacher-profile/repositories/teacher.repository'

@Injectable({ providedIn: 'root' })
export class TeacherProfileService {
  private readonly teacherProfileRepository = inject(TeacherProfileRepository)

  public async getTeacherProfileById(id: string): Promise<TeacherProfileModel> {
    try {
      const teacherProfile = await this.teacherProfileRepository.getById(id)

      if (teacherProfile === null)
        throw new ErrorResponse('teacher-profile-not-exist')

      return TeacherProfileMapper.toModel(teacherProfile)
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      console.error(error)
      throw new ErrorResponse(error.code)
    }
  }
}
