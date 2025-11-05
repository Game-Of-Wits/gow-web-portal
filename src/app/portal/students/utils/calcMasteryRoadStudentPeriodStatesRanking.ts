import { MasteryRoadStudentPeriodState } from "~/students/models/MasteryRoadStudentPeriodState";
import { MasteryRoadStudentPeriodStateRanking } from "~/students/models/MasteryRoadStudentPeriodStateRanking";

export const calcMasteryRoadStudentPeriodStatesRanking = (studentPeriodStates: MasteryRoadStudentPeriodState[]) => {
  const studentSorted = [...studentPeriodStates].sort((a, b) => b.progressPoints - a.progressPoints)

  const maxStudentProgressPoints = studentSorted[0]

  const studentRankingPositionMap = new Map<string, number>()
  let currentRank = 0
  let prevPoints: number | null = null
  let seen = 0

  for (const student of studentSorted) {
    seen += 1
    if (prevPoints === null || student.progressPoints !== prevPoints) {
      currentRank = seen
      prevPoints = student.progressPoints
    }
    studentRankingPositionMap.set(student.id, currentRank)
  }

  const rankingStudents: MasteryRoadStudentPeriodStateRanking[] = studentSorted.map((student) => {
    const rawVigesimalScore = maxStudentProgressPoints.progressPoints === student.progressPoints
      ? 20
      : (20 * student.progressPoints) / maxStudentProgressPoints.progressPoints

    return {
      state: student,
      rank: studentRankingPositionMap.get(student.id) ?? 0,
      vigesimalScore: Number.parseFloat(rawVigesimalScore.toFixed(1))
    }
  })

  return rankingStudents;
}
