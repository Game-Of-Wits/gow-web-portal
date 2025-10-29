import { Injectable, inject } from '@angular/core'
import { FirestoreError } from '@angular/fire/firestore'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { catchError, map, Observable, throwError } from 'rxjs'
import { HomeworkMapper } from '~/homeworks/mappers/homework.mapper'
import { CreateHomework } from '~/homeworks/models/CreateHomework.model'
import { HomeworkModel } from '~/homeworks/models/Homework.model'
import { UpdateHomework } from '~/homeworks/models/UpdateHomework.model'
import { UpdateHomeworkParams } from '~/homeworks/models/UpdateHomeworkParams.model'
import { HomeworkRepository } from '~/homeworks/repositories/homework.repository'
import { HomeworkGroupRepository } from '~/homeworks/repositories/homework-group.repository'
import { StorageHomeworkService } from '../storage-homework/storage-homework.service'

@Injectable({ providedIn: 'root' })
export class HomeworkService {
  private readonly homeworkRepository = inject(HomeworkRepository)
  private readonly homeworkGroupRepository = inject(HomeworkGroupRepository)

  private readonly storageHomework = inject(StorageHomeworkService)

  public async getHomeworkById(homeworkId: string): Promise<HomeworkModel> {
    try {
      const homework = await this.homeworkRepository.getByIdAsync(homeworkId)
      if (homework === null) throw new ErrorResponse('homework-not-exist')
      return HomeworkMapper.toModel(homework)
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public getAllHomeworksByGroupId(
    homeworkGroupId: string
  ): Observable<HomeworkModel[]> {
    return this.homeworkRepository
      .getAllByHomeworkGroupId(homeworkGroupId)
      .pipe(
        map(homeworks => HomeworkMapper.toListModel(homeworks)),
        catchError(err => {
          if (err instanceof FirestoreError)
            return throwError(() => new ErrorResponse(err.code))
          return throwError(() => err)
        })
      )
  }

  public async createHomework({
    schoolId,
    classroomId,
    data
  }: {
    schoolId: string
    classroomId: string
    data: CreateHomework
  }): Promise<HomeworkModel> {
    try {
      const { image, ...createData } = data

      const homeworkGroup = await this.homeworkGroupRepository.getByIdAsync(
        data.groupId
      )

      if (homeworkGroup === null)
        throw new ErrorResponse('homework-group-not-exist')

      const homeworkId = this.homeworkRepository.generateRef().id

      const homeworkProblemImagePath =
        await this.storageHomework.uploadHomeworkProblem(
          {
            schoolId,
            classroomId,
            homeworkId
          },
          image
        )

      const homework = await this.homeworkRepository.createById(
        homeworkId,
        homeworkGroup,
        {
          ...createData,
          image: homeworkProblemImagePath
        }
      )

      return HomeworkMapper.toModel(homework)
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public async updateHomeworkById(
    pathIds: { schoolId: string; classroomId: string },
    updateData: { homeworkId: string; data: Partial<UpdateHomework> }
  ): Promise<void> {
    try {
      const { image, ...data } = updateData.data

      const updateHomeworkData: Partial<UpdateHomeworkParams> = { ...data }

      const homeworkExist = await this.homeworkRepository.existByIdAsync(
        updateData.homeworkId
      )

      if (!homeworkExist) throw new ErrorResponse('homework-not-exist')

      if (image) {
        const homeworkProblemImagePath =
          await this.storageHomework.uploadHomeworkProblem(
            {
              schoolId: pathIds.schoolId,
              classroomId: pathIds.classroomId,
              homeworkId: updateData.homeworkId
            },
            image
          )

        updateHomeworkData.image = homeworkProblemImagePath
      }

      await this.homeworkRepository.updateById(
        updateData.homeworkId,
        updateHomeworkData
      )
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public async deleteHomeworkById(homeworkId: string): Promise<void> {
    try {
      const homework = await this.homeworkRepository.getByIdAsync(homeworkId)
      if (homework === null) throw new ErrorResponse('homework-not-exist')
      await this.homeworkRepository.deleteById(homework.id)
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }
}
