import { AuthUserModel } from '~/shared/models/AuthUser'
import { TeacherProfileModel } from '~/teacher-profile/models/TeacherProfile.model'
import { UserModel } from '../models/User'

export class AuthUserMapper {
  static toModel(user: UserModel, profile: TeacherProfileModel): AuthUserModel {
    return {
      id: user.id,
      email: user.email,
      photoUrl: user.photoUrl,
      lastName: profile.lastName,
      firstName: profile.firstName
    }
  }
}
