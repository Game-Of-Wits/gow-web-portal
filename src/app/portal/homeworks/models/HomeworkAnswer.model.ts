export interface HomeworkAnswerModel {
  id: string
  studentStateId: string
  homeworkId: string
  respondedAt: Date
  content: HomeworkAnswerContent
}

export type HomeworkAnswerContent = HomeworkAnswerSingleChoiseContent

export interface HomeworkAnswerSingleChoiseContent {
  optionSelectedId: string
}
