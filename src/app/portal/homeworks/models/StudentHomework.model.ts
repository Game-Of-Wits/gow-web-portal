export enum StudentHomeworkStatus {
  PENDING = 'PENDING',
  CORRECT_ANSWER = 'CORRECT_ANSWER',
  WRONG_ANSWER = 'WRONG_ANSWER',
  FAILED_DEADLINE = 'FAILED_DEADLINE'
}

export interface StudentHomeworkModel {
  id: string
  studentStateId: string
  homeworkId: string
  deadline: Date
  deliveredAt: Date
  rewardAbilityId: string
  answerId: string | null
  status: StudentHomeworkStatus
}
