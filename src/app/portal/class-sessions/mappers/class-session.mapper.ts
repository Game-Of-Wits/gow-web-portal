import { ClassSessionModel } from '../models/ClassSession.model'
import { ClassSessionDbModel } from '../models/ClassSessionDb.model'

export class ClassSessionMapper {
  static toModel(classSession: ClassSessionDbModel): ClassSessionModel {
    const experienceSessionIds: string[] = classSession.experienceSessions.map(
      session => session.id
    )

    return {
      id: classSession.id,
      academicPeriodId: classSession.academicPeriod.id,
      endedAt: classSession.endedAt?.toDate() ?? null,
      startedAt: classSession.startedAt.toDate(),
      experienceSessionIds
    }
  }

  static toListModel(
    classSessions: ClassSessionDbModel[]
  ): ClassSessionModel[] {
    return classSessions.map(this.toModel)
  }
}
