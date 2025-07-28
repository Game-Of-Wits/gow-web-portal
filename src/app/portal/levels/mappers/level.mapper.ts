import { LevelModel } from '../models/Level.model'
import { LevelDbModel } from '../models/LevelDb.model'

export class LevelMapper {
  static toModel(level: LevelDbModel): LevelModel {
    const abilityIds = level.abilities.map(ability => ability.id)

    return {
      id: level.id,
      name: level.name,
      primaryColor: level.primaryColor,
      requiredPoints: level.requiredPoints,
      classroomId: level.classroom.id,
      abilityIds
    }
  }

  static toListModel(levels: LevelDbModel[]): LevelModel[] {
    return levels.map(LevelMapper.toModel)
  }
}
