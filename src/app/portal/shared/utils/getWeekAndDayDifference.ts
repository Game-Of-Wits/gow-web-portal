export function getWeekAndDayDifference(startDate: Date): {
  week: number
  day: number
} {
  const milisecondsDiff =
    ignoreTime(new Date()).getTime() - ignoreTime(startDate).getTime()

  if (milisecondsDiff < 0) {
    throw new Error('La fecha de inicio es futura, debe ser pasada.')
  }

  const days = Math.floor(milisecondsDiff / (1000 * 60 * 60 * 24))
  const week = Math.floor(days / 7) + 1
  const day = (days % 7) + 1

  return { week, day }
}

function ignoreTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
