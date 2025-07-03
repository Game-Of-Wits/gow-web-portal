import { Timestamp } from '@angular/fire/firestore'
import type { AcademicPeriodModel } from '../models/AcademicPeriod.model'
import { AcademicPeriodDbModel } from '../models/AcademicPeriodDb.model'

export class AcademicPeriodMapper {
  public static toModel(
    academicPeriod: AcademicPeriodDbModel
  ): AcademicPeriodModel {
    const endedAt = academicPeriod.endedAt as Timestamp | null
    const startedAt = academicPeriod.startedAt as Timestamp | null
    const classSessionIds = academicPeriod.classSessions.map(
      classSessionId => classSessionId.id
    )

    return {
      id: academicPeriod.id,
      classSessionIds,
      endedAt: endedAt?.toDate() ?? null,
      name: academicPeriod.name,
      startedAt: startedAt?.toDate() ?? null,
      schoolId: academicPeriod.school.id
    }
  }
}
