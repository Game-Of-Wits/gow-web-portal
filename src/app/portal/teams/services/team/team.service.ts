import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'
import { TeamMapper } from '~/teams/mappers/team.mapper'
import { TeamModel } from '~/teams/models/Team.model'
import { TeamRepository } from '~/teams/repositories/team.repository'

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly teamRepository = inject(TeamRepository)

  public getAllTeamsByClassroom(classroomId: string): Observable<TeamModel[]> {
    return this.teamRepository
      .getAllByClassroomId(classroomId)
      .pipe(map(teams => TeamMapper.toListModel(teams)))
  }
}
