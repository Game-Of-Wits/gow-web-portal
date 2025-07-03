import type { ClassroomModel } from '../models/Classroom.model'
import type { ClassroomDbModel } from '../models/ClassroomDb.model'

export class ClassroomMapper {
  static toModel(classroom: ClassroomDbModel): ClassroomModel {
    const studentIds = classroom.students.map(classroomRef => classroomRef.id)

    return {
      id: classroom.id,
      name: classroom.name,
      schoolId: classroom.school.id,
      gradeYearId: classroom.gradeYear.id,
      isSetupReady: classroom.isSetupReady,
      teacherId: classroom.teacher.id,
      studentIds
    }
  }

  static toListModels(classrooms: ClassroomDbModel[]): ClassroomModel[] {
    return classrooms.map(classroom => this.toModel(classroom))
  }
}
