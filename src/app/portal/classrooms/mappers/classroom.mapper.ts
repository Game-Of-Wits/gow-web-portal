import { EducationalExperience } from '~/shared/models/EducationalExperience'
import type { ClassroomModel } from '../models/Classroom.model'
import type { ClassroomDbModel } from '../models/ClassroomDb.model'

export class ClassroomMapper {
  static toModel(classroom: ClassroomDbModel): ClassroomModel {
    const studentIds = classroom.students.map(classroomRef => classroomRef.id)

    const shadowWarfareDbConfig =
      classroom.experiences[EducationalExperience.SHADOW_WARFARE]
    const masteryRoadDbConfig =
      classroom.experiences[EducationalExperience.MASTERY_ROAD]

    return {
      id: classroom.id,
      name: classroom.name,
      schoolId: classroom.school.id,
      gradeYearId: classroom.gradeYear.id,
      isSetupReady: classroom.isSetupReady,
      teacherId: classroom.teacher.id,
      studentIds,
      experiences: {
        [EducationalExperience.MASTERY_ROAD]: {
          levels: masteryRoadDbConfig.levels.map(level => level.id)
        },
        [EducationalExperience.SHADOW_WARFARE]: {
          healthPointsBase: shadowWarfareDbConfig.healthPointsBase,
          limitAbilities: shadowWarfareDbConfig.limitAbilities
        }
      }
    }
  }

  static toListModels(classrooms: ClassroomDbModel[]): ClassroomModel[] {
    return classrooms.map(classroom => this.toModel(classroom))
  }
}
