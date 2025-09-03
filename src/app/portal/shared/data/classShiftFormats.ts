import { ClassShift } from '../models/ClassShift'

export const classShiftFormats: Record<ClassShift, string> = {
  [ClassShift.MORNING]: 'Mañana',
  [ClassShift.AFTERNOON]: 'Tarde',
  [ClassShift.NIGHT]: 'Noche'
}
