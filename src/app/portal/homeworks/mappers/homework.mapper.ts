import { HomeworkModel } from '../models/Homework.model'
import { HomeworkDbModel } from '../models/HomeworkDb.model'

export class HomeworkMapper {
  static toModel(homework: HomeworkDbModel): HomeworkModel {
    return {
      id: homework.id,
      name: homework.name,
      category: homework.category,
      content: {
        correctOptionId: homework.content.correctOption.id,
        optionIds: homework.content.options.map(option => option.id)
      },
      image: homework.image,
      groupId: homework.group.id
    }
  }

  static toListModel(homeworks: HomeworkDbModel[]): HomeworkModel[] {
    return homeworks.map(HomeworkMapper.toModel)
  }
}
