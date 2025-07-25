export interface HomeworkGroupModel {
  id: string
  name: string
  classroomId: string
  homeworkIds: string[]
  createdAt: Date
  deliveredAt: Date | null
  baseDateLimit: Date | null
}
