import { Injectable, inject } from '@angular/core'
import { FirestoreError } from '@angular/fire/firestore'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { catchError, map, Observable, throwError } from 'rxjs'
import { AcademicPeriodRespository } from '~/academic-periods/repositories/academic-period.repository'
import { CharacterRepository } from '~/characters/repositories/character.repository'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { DefaultSchoolStore } from '~/shared/store/default-school.store'
import { TeamMapper } from '~/teams/mappers/team.mapper'
import { CreateTeam } from '~/teams/models/CreateTeam.model'
import { TeamModel } from '~/teams/models/Team.model'
import { UpdateTeam } from '~/teams/models/UpdateTeam.model'
import { TeamRepository } from '~/teams/repositories/team.repository'

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly teamRepository = inject(TeamRepository)
  private readonly classroomRepository = inject(ClassroomRepository)
  private readonly characterRepository = inject(CharacterRepository)
  private readonly academicPeriodRepository = inject(AcademicPeriodRespository)
  private readonly defaultSchoolStore = inject(DefaultSchoolStore)

  public async getTeamById(teamId: string): Promise<TeamModel> {
    try {
      const team = await this.teamRepository.getById(teamId)
      if (team === null) throw new ErrorResponse('team-not-exist')
      return TeamMapper.toModel(team)
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public getAllTeamsByClassroom(classroomId: string): Observable<TeamModel[]> {
    return this.teamRepository.getAllByClassroomId(classroomId).pipe(
      map(teams => TeamMapper.toListModel(teams)),
      catchError(err => {
        if (err instanceof FirestoreError)
          return throwError(() => new ErrorResponse(err.code))

        return throwError(() => err)
      })
    )
  }

  public async createTeam(data: CreateTeam): Promise<TeamModel> {
    try {
      const classroomExist = await this.classroomRepository.existById(
        data.classroomId
      )
      if (!classroomExist) throw new ErrorResponse('classroom-not-exist')

      const newTeam = await this.teamRepository.create(data)

      return TeamMapper.toModel(newTeam)
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public async updateTeamById(
    teamId: string,
    data: Partial<UpdateTeam>
  ): Promise<void> {
    try {
      const teamExist = await this.teamRepository.existById(teamId)
      if (!teamExist) throw new ErrorResponse('team-not-exist')

      const updateData = structuredClone(data)

      if (updateData.classroomId) {
        const classroomExist = await this.classroomRepository.existById(
          updateData.classroomId
        )
        if (!classroomExist) throw new ErrorResponse('classroom-not-exist')
      }

      await this.teamRepository.updateById(teamId, updateData)
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public async deleteTeamById(
    teamId: string,
    classroomId: string
  ): Promise<void> {
    try {
      const schoolId = this.defaultSchoolStore.school()?.id ?? null
      if (schoolId === null) throw new ErrorResponse('school-not-found')

      const activeAcademicPeriod =
        await this.academicPeriodRepository.existsSchoolActiveAcademicPeriod(
          schoolId
        )
      if (activeAcademicPeriod)
        throw new ErrorResponse('delete-team-not-allowed-by-active-period')

      const teamExist = await this.teamRepository.existById(teamId)
      if (!teamExist) throw new ErrorResponse('team-not-exist')

      const teamsCount =
        await this.teamRepository.countByClassroomId(classroomId)

      if (teamsCount === 2)
        throw new ErrorResponse('delete-team-not-allowed-by-limit')

      await this.characterRepository.deleteAllByTeamId(teamId)
      await this.teamRepository.deleteById(teamId)
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }
}
