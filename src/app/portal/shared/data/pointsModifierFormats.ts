import { PointsModifier } from '../models/PointsModifier'

export const pointsModifierFormats: Record<PointsModifier, string> = {
  [PointsModifier.DECREASE]: 'Disminuir',
  [PointsModifier.INCREMENT]: 'Incrementar'
}
