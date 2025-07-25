import { TeamModel } from '../models/Team.model'
import { TeamDbModel } from '../models/TeamDb.model'

export class TeamMapper {
  static toModel(team: TeamDbModel): TeamModel {
    const characterIds = team.characters.map(team => team.id)

    return {
      id: team.id,
      name: team.name,
      classroomId: team.classroom.id,
      characterIds
    }
  }

  static toListModel(teams: TeamDbModel[]): TeamModel[] {
    return teams.map(this.toModel)
  }
}
