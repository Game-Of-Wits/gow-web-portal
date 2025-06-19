import { AuthUserModel } from '~/shared/models/AuthUser'

export class AuthUserMapper {
  static toModel(authUser: any): AuthUserModel {
    return {
      email: authUser.email,
      id: authUser.uid,
      photoURL: authUser.photoURL
    }
  }
}
