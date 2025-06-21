import { TeacherProfileModel } from '../models/TeacherProfile'

export class TeacherProfileMapper {
  static toModel(profile: any): TeacherProfileModel {
    return {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName
    }
  }
}
