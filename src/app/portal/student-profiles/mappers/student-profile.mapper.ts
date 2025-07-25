import { StudentProfileModel } from '../models/StudentProfile.model'
import { StudentProfileDbModel } from '../models/StudentProfileDb.model'

export class StudentProfileMapper {
  static toModel(profile: StudentProfileDbModel): StudentProfileModel {
    const classroomIds = profile.classrooms.map(classroom => classroom.id)

    return {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      classroomIds,
      phoneNumber: profile.phoneNumber
    }
  }

  static toListModel(profiles: StudentProfileDbModel[]): StudentProfileModel[] {
    return profiles.map(this.toModel)
  }
}
