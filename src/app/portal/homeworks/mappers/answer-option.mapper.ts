import { AnswerOptionModel } from '../models/AnswerOption.model'
import { AnswerOptionDb } from '../models/AnswerOptionDb.model'

export class AnswerOptionMapper {
  static toModel(answerOption: AnswerOptionDb): AnswerOptionModel {
    return {
      id: answerOption.id,
      homeworkId: answerOption.homework.id,
      answer: answerOption.answer
    }
  }

  static toListModel(answersOptions: AnswerOptionDb[]): AnswerOptionModel[] {
    return answersOptions.map(AnswerOptionMapper.toModel)
  }
}
