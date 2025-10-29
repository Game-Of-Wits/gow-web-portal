import {
  StudentHomeworkModel,
  StudentHomeworkStatus
} from '../models/StudentHomework.model'
import { StudentHomeworkDb } from '../models/StudentHomeworkDb.model'

export class StudentHomeworkMapper {
  static toModel(studentHomework: StudentHomeworkDb): StudentHomeworkModel {
    return {
      id: studentHomework.id,
      answerId: studentHomework.answer?.id ?? null,
      deadline: studentHomework.deadline.toDate(),
      deliveredAt: studentHomework.deliveredAt.toDate(),
      homeworkId: studentHomework.homework.id,
      rewardAbilityId: studentHomework.rewardAbility.id,
      status: studentHomework.status as StudentHomeworkStatus,
      studentStateId: studentHomework.studentState.id
    }
  }

  static toList(studentHomeworks: StudentHomeworkDb[]): StudentHomeworkModel[] {
    return studentHomeworks.map(studentHomework =>
      this.toModel(studentHomework)
    )
  }
}
