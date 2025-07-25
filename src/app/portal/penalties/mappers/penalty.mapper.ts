import { PenaltyModel } from '../models/Penalty.model'
import { PenaltyDbModel } from '../models/PenaltyDb.model'

export class PenaltyMapper {
  static toModel(penalty: PenaltyDbModel): PenaltyModel {
    return {
      id: penalty.id,
      name: penalty.name,
      reducePoints: penalty.reducePoints
    }
  }

  static toListModel(penalties: PenaltyDbModel[]): PenaltyModel[] {
    return penalties.map(this.toModel)
  }
}
