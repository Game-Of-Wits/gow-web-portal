import { ExperienceSessionModel } from '../models/ExperienceSession.model'
import { ExperienceSessionDbModel } from '../models/ExperienceSessionDb.model'

export class ExperienceSessionMapper {
  static toModel(
    experienceSession: ExperienceSessionDbModel
  ): ExperienceSessionModel {
    return {
      id: experienceSession.id,
      startedAt: experienceSession.startedAt.toDate(),
      endedAt: experienceSession.endedAt?.toDate() ?? null,
      experience: experienceSession.experience,
      classSessionId: experienceSession.classSession.id
    }
  }

  static toListModel(
    experienceSessions: ExperienceSessionDbModel[]
  ): ExperienceSessionModel[] {
    return experienceSessions.map(this.toModel)
  }
}
