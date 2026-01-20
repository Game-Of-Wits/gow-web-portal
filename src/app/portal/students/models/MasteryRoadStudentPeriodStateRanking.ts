import { MasteryRoadStudentPeriodState } from '~/students/models/MasteryRoadStudentPeriodState'

export interface MasteryRoadStudentPeriodStateRanking<
  T = MasteryRoadStudentPeriodState
> {
  state: T
  rank: number
  vigesimalScore: number
}
