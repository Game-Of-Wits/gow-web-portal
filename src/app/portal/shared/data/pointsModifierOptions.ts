import { PointsModifier } from '../models/PointsModifier'
import { SelectOption } from '../types/SelectOption'
import { pointsModifierFormats } from './pointsModifierFormats'

export const pointsModifierOptions: SelectOption[] = Object.entries(
  pointsModifierFormats
).map(([key, value]) => ({
  name: value,
  code: key as PointsModifier
}))
