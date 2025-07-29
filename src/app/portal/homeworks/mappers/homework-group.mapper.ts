import { HomeworkGroupModel } from '../models/HomeworkGroup.model'
import { HomeworkGroupDbModel } from '../models/HomeworkGroupDb.model'

export class HomeworkGroupMapper {
  static toModel(group: HomeworkGroupDbModel): HomeworkGroupModel {
    const homeworkIds = group.homeworks.map(homework => homework.id)

    return {
      classroomId: group.classroom.id,
      id: group.id,
      baseDateLimit: group.baseDateLimit?.toDate() ?? null,
      createdAt: group.createdAt.toDate(),
      deliveredAt: group.deliveredAt?.toDate() ?? null,
      homeworkIds,
      name: group.name
    }
  }

  static toListModel(groups: HomeworkGroupDbModel[]): HomeworkGroupModel[] {
    return groups.map(HomeworkGroupMapper.toModel)
  }
}
