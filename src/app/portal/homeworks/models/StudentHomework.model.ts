export enum StudentHomeworkStatus {
  PENDING = 'PENDING',
  CORRECT_ANSWER = 'CORRECT_ANSWER',
  WRONG_ANSWER = 'WRONG_ANSWER',
  FAILED_DEADLINE = 'FAILED_DEADLINE'
}

export interface StudentHomeworkModel {
  id: string
  studentStateId: String
  homeworkId: String
  deadline: Date
  answerId: String | null
  status: StudentHomeworkStatus
}
