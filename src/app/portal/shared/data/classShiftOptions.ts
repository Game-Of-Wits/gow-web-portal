import { ClassShift } from '../models/ClassShift'
import { SelectOption } from '../types/SelectOption'
import { classShiftFormats } from './classShiftFormats'

export const classShiftOptions: SelectOption[] = Object.entries(
  classShiftFormats
).map(([key, value]) => ({
  name: value,
  code: key as ClassShift
}))
