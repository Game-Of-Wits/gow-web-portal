import { MasteryRoadStudentPeriodStateRanking } from '~/students/models/MasteryRoadStudentPeriodStateRanking'

export const calcMasteryRoadStudentPeriodStatesRanking = <
  T extends { progressPoints: number }
>(
  studentPeriodStates: T[]
): MasteryRoadStudentPeriodStateRanking<T>[] => {
  const studentSorted = [...studentPeriodStates].sort(
    (a, b) => b.progressPoints - a.progressPoints
  )

  const maxProgressPoints = studentSorted[0]?.progressPoints ?? 0

  const studentRankingPositionMap = new Map<T, number>()
  let currentRank = 0
  let prevPoints: number | null = null
  let seen = 0

  for (const student of studentSorted) {
    seen += 1
    if (prevPoints === null || student.progressPoints !== prevPoints) {
      currentRank = seen
      prevPoints = student.progressPoints
    }
    studentRankingPositionMap.set(student, currentRank)
  }

  const rankingStudents: MasteryRoadStudentPeriodStateRanking<T>[] =
    studentSorted.map(student => {
      let rawVigesimalScore: number

      if (maxProgressPoints === 0) rawVigesimalScore = 0
      else if (student.progressPoints === maxProgressPoints)
        rawVigesimalScore = 20
      else rawVigesimalScore = (20 * student.progressPoints) / maxProgressPoints

      return {
        state: student,
        rank: studentRankingPositionMap.get(student) ?? 0,
        vigesimalScore: Number.parseFloat(rawVigesimalScore.toFixed(1))
      }
    })

  return rankingStudents
}
