import { Injectable, inject } from '@angular/core'
import { FirestoreError } from '@angular/fire/firestore'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { AnswerOptionMapper } from '~/homeworks/mappers/answer-option.mapper'
import { AnswerOptionModel } from '~/homeworks/models/AnswerOption.model'
import { HomeworkCategory } from '~/homeworks/models/HomeworkCategory.model'
import { AnswerOptionRepository } from '~/homeworks/repositories/answer-option.repository'
import { HomeworkRepository } from '~/homeworks/repositories/homework.repository'

@Injectable({ providedIn: 'root' })
export class AnswerOptionService {
  private readonly answerOptionRepository = inject(AnswerOptionRepository)
  private readonly homeworkRepository = inject(HomeworkRepository)

  public async getAnswerOptionsByHomeworkIdAsync(
    homeworkId: string
  ): Promise<AnswerOptionModel[]> {
    try {
      const homework = await this.homeworkRepository.getByIdAsync(homeworkId)

      if (homework === null) throw new ErrorResponse('homework-not-exist')

      if (homework.category !== HomeworkCategory.SINGLE_CHOISE)
        throw new ErrorResponse('homework-is-not-single-choise')

      const answerOptions =
        await this.answerOptionRepository.getAllByHomeworkIdAsync(homeworkId)

      return AnswerOptionMapper.toListModel(answerOptions)
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }
}
