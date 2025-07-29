import { Injectable, inject } from '@angular/core'
import { HomeworkGroupMapper } from '~/homeworks/mappers/homework-group.mapper'
import { HomeworkGroupRepository } from '~/homeworks/repositories/homework-group.repository'

@Injectable({ providedIn: 'root' })
export class HomeworkGroupService {
  private readonly homeworkGroupRepository = inject(HomeworkGroupRepository)

  public async getAllHomeworkGroupsByClassroomAsync(classroomId: string) {
    const homeworkGroups =
      await this.homeworkGroupRepository.getAllByClassroomIdAsync(classroomId)
    return HomeworkGroupMapper.toListModel(homeworkGroups)
  }
}
