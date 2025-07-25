export interface ClassSessionModel {
  id: string
  startedAt: Date
  endedAt: Date | null
  experienceSessionIds: string[]
  academicPeriodId: string
}
