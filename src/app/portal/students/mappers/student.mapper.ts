import { Injectable } from '@angular/core'
import { DocumentReference } from '@angular/fire/firestore'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { StudentModel } from '../models/Student.model'
import { StudentDbModel } from '../models/StudentDb.model'

@Injectable({ providedIn: 'root' })
export class StudentMapper {
  public toModel(student: StudentDbModel): StudentModel {
    const experiences = this.studentExperiencesToModel(student.experiences)

    return {
      id: student.id,
      experiences,
      classroomId: student.classroom.id,
      profileId: student.profile.id
    }
  }

  private studentExperiencesToModel(experiences: {
    [key: string]: DocumentReference
  }): Map<EducationalExperience, string> {
    const experienesMapped: Map<EducationalExperience, string> = new Map()

    if (experiences[EducationalExperience.SHADOW_WARFARE] !== undefined) {
      const studentPeriodStateId =
        experiences[EducationalExperience.SHADOW_WARFARE].id
      experienesMapped.set(
        EducationalExperience.SHADOW_WARFARE,
        studentPeriodStateId
      )
    }

    if (experiences[EducationalExperience.MASTERY_ROAD] !== undefined) {
      const studentPeriodStateId =
        experiences[EducationalExperience.MASTERY_ROAD].id
      experienesMapped.set(
        EducationalExperience.MASTERY_ROAD,
        studentPeriodStateId
      )
    }

    return experienesMapped
  }
}
