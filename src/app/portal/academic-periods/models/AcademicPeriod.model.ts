export interface AcademicPeriodModel {
  id: string
  name: string
  classSessionIds: string[]
  endedAt: Date | null
  startedAt: Date
  schoolId: string
}
