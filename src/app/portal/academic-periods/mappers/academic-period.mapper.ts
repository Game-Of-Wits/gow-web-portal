import { Timestamp } from '@angular/fire/firestore'
import type { AcademicPeriodModel } from '../models/AcademicPeriod.model'
import { AcademicPeriodDbModel } from '../models/AcademicPeriodDb.model'

export class AcademicPeriodMapper {
  static toModel(academicPeriod: AcademicPeriodDbModel): AcademicPeriodModel {
    const endedAt = academicPeriod.endedAt as Timestamp | null
    const classSessionIds = academicPeriod.classSessions.map(
      classSessionId => classSessionId.id
    )

    return {
      id: academicPeriod.id,
      classSessionIds,
      name: academicPeriod.name,
      endedAt: endedAt?.toDate() ?? null,
      startedAt: academicPeriod.startedAt.toDate(),
      schoolId: academicPeriod.school.id
    }
  }

  static toListModel(
    academicPeriods: AcademicPeriodDbModel[]
  ): AcademicPeriodModel[] {
    return academicPeriods.map(AcademicPeriodMapper.toModel)
  }
}
