import { Injectable, inject } from '@angular/core'
import { FirestoreError } from '@angular/fire/firestore'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { catchError, map, Observable, throwError } from 'rxjs'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { HomeworkMapper } from '~/homeworks/mappers/homework.mapper'
import { CreateHomework } from '~/homeworks/models/CreateHomework.model'
import { HomeworkModel } from '~/homeworks/models/Homework.model'
import { HomeworkInfo } from '~/homeworks/models/HomeworkInfo.model'
import { AnswerOptionRepository } from '~/homeworks/repositories/answer-option.repository'
import { HomeworkRepository } from '~/homeworks/repositories/homework.repository'
import { HomeworkGroupRepository } from '~/homeworks/repositories/homework-group.repository'
import { StudentPeriodStateRepository } from '~/students/repositories/student-period-state.repository'
import { StorageHomeworkService } from '../storage-homework/storage-homework.service'

@Injectable({ providedIn: 'root' })
export class HomeworkService {
  private readonly homeworkRepository = inject(HomeworkRepository)
  private readonly homeworkGroupRepository = inject(HomeworkGroupRepository)
  private readonly answerOptionRepository = inject(AnswerOptionRepository)
  private readonly classroomRepository = inject(ClassroomRepository)
  private readonly studentPeriodStateRepository = inject(
    StudentPeriodStateRepository
  )

  private readonly storageHomework = inject(StorageHomeworkService)

  public async getHomeworkInfoByStudentPeriodStateIdAndClassroomId(
    studentPeriodStateId: string,
    classroomId: string
  ): Promise<HomeworkInfo> {
    try {
      const classroomExist =
        await this.classroomRepository.existById(classroomId)
      if (!classroomExist) throw new ErrorResponse('classroom-not-exist')

      const studentPeriodState =
        await this.studentPeriodStateRepository.getByIdAsync(
          studentPeriodStateId
        )

      if (studentPeriodState === null)
        throw new ErrorResponse('student-period-state-not-exist')

      return await this.homeworkRepository.getHomeworkInfoByStudentPeriodAndClassroom(
        studentPeriodState.id,
        classroomId
      )
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

  public async create(data: CreateHomework): Promise<HomeworkModel> {
    try {
      const homeworkGroupExist =
        await this.homeworkGroupRepository.existByIdAsync(data.groupId)
      if (!homeworkGroupExist)
        throw new ErrorResponse('homework-group-not-exist')

      const homeworkId = this.homeworkRepository.generateId()

      const answerOptions = await this.answerOptionRepository.createAll(
        homeworkId,
        data.content.options
      )

      const correctOption = answerOptions.find(
        option => option.answer === data.content.correctOption
      )

      if (correctOption === undefined)
        throw new ErrorResponse('correct-option-not-found')

      const homeworkProblemImagePath =
        await this.storageHomework.uploadHomeworkProblem(homeworkId, data.image)

      const homework = await this.homeworkRepository.create({
        image: homeworkProblemImagePath,
        name: data.name,
        groupId: data.groupId,
        category: data.category,
        content: {
          correctOption: this.homeworkRepository.getRefById(correctOption.id),
          options: answerOptions.map(option =>
            this.answerOptionRepository.getRefById(option.id)
          )
        }
      })

      return HomeworkMapper.toModel(homework)
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }
}
