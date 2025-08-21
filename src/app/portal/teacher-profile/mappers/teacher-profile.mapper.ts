import { TeacherProfileModel } from '~/teacher-profile/models/TeacherProfile.model'
import { TeacherProfileDbModel } from '~/teacher-profile/models/TeacherProfileDb.model'

export class TeacherProfileMapper {
  static toModel(profile: TeacherProfileDbModel): TeacherProfileModel {
    return {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName
    }
  }
}
