import { CharacterModel } from '../models/Character.model'
import { CharacterDbModel } from '../models/CharacterDb.model'

export class CharacterMapper {
  static toModel(character: CharacterDbModel): CharacterModel {
    const abilityIds = character.abilities.map(ability => ability.id)

    return {
      id: character.id,
      name: character.name,
      teamId: character.team.id,
      abilityIds
    }
  }

  static toListModel(characters: CharacterDbModel[]): CharacterModel[] {
    return characters.map(this.toModel)
  }
}
