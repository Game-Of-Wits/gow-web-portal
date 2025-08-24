import { Injectable, inject } from '@angular/core'
import { FirebaseError } from '@angular/fire/app'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { HomeworkGroupMapper } from '~/homeworks/mappers/homework-group.mapper'
import { CreateHomeworkGroup } from '~/homeworks/models/CreateHomeworkGroup.model'
import { HomeworkGroupModel } from '~/homeworks/models/HomeworkGroup.model'
import { HomeworkGroupRepository } from '~/homeworks/repositories/homework-group.repository'

@Injectable({ providedIn: 'root' })
export class HomeworkGroupService {
  private readonly homeworkGroupRepository = inject(HomeworkGroupRepository)
  private readonly classroomRepository = inject(ClassroomRepository)

  public async getAllHomeworkGroupsByClassroomAsync(classroomId: string) {
    try {
      const homeworkGroups =
        await this.homeworkGroupRepository.getAllByClassroomIdAsync(classroomId)
      return HomeworkGroupMapper.toListModel(homeworkGroups)
    } catch (err) {
      const error = err as ErrorResponse | FirebaseError
      throw new ErrorResponse(error.code)
    }
  }

  public async getHomeworkGroupById(
    homeworkGroupId: string
  ): Promise<HomeworkGroupModel> {
    try {
      const homeworkGroup =
        await this.homeworkGroupRepository.getByIdAsync(homeworkGroupId)
      if (homeworkGroup === null)
        throw new ErrorResponse('homework-group-not-exist')
      return HomeworkGroupMapper.toModel(homeworkGroup)
    } catch (err) {
      const error = err as ErrorResponse | FirebaseError
      throw new ErrorResponse(error.code)
    }
  }

  public async create(data: CreateHomeworkGroup): Promise<HomeworkGroupModel> {
    try {
      const classroomExists = await this.classroomRepository.existById(
        data.classroomId
      )

      if (!classroomExists) throw new ErrorResponse('classroom-not-exist')

      const newHomeworkGroup = await this.homeworkGroupRepository.create(data)

      return HomeworkGroupMapper.toModel(newHomeworkGroup)
    } catch (err) {
      const error = err as ErrorResponse | FirebaseError
      throw new ErrorResponse(error.code)
    }
  }
}
