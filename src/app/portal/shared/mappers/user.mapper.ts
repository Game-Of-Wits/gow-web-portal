import { UserModel } from '../models/User'

export class UserMapper {
  static toModel(user: any): UserModel {
    return {
      id: user.uid,
      email: user.email,
      photoUrl: user.photoURL
    }
  }
}
