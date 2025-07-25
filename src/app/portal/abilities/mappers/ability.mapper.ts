import { AbilityModel } from '../models/Ability.model'
import { AbilityDbModel } from '../models/AbilityDb.model'

export class AbilityMapper {
  static toModel(ability: AbilityDbModel): AbilityModel {
    return {
      id: ability.id,
      experience: ability.experience,
      description: ability.description,
      isInitial: ability.isInitial,
      name: ability.name,
      type: ability.type,
      usage: ability.usage
    }
  }
}
