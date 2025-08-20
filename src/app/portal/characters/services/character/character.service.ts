import { Injectable, inject } from '@angular/core'
import { FirestoreError } from '@angular/fire/firestore'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { catchError, map, Observable, throwError } from 'rxjs'
import { AbilityRepository } from '~/abilities/repositories/ability.repository'
import { CharacterMapper } from '~/characters/mappers/character.mapper'
import { CharacterModel } from '~/characters/models/Character.model'
import { CreateCharacter } from '~/characters/models/CreateCharacter.model'
import { UpdateCharacter } from '~/characters/models/UpdateCharacter.model'
import { CharacterRepository } from '~/characters/repositories/character.repository'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { TeamRepository } from '~/teams/repositories/team.repository'

@Injectable({ providedIn: 'root' })
export class CharacterService {
  private readonly characterRepository = inject(CharacterRepository)
  private readonly classroomRepository = inject(ClassroomRepository)
  private readonly teamRepository = inject(TeamRepository)
  private readonly abilityRepository = inject(AbilityRepository)

  public async getCharacterByIdAsync(id: string): Promise<CharacterModel> {
    const character = await this.characterRepository.getByIdAsync(id)
    if (character === null) throw new ErrorResponse('character-not-exist')
    return CharacterMapper.toModel(character)
  }

  public getAllCharactersByClassroom(
    classroomId: string
  ): Observable<CharacterModel[]> {
    return this.characterRepository.getAllByClassroomId(classroomId).pipe(
      map(characters => CharacterMapper.toListModel(characters)),
      catchError(err => {
        if (err instanceof FirestoreError)
          return throwError(() => new ErrorResponse(err.code))
        return throwError(() => err)
      })
    )
  }

  public async createCharacter(data: CreateCharacter): Promise<CharacterModel> {
    try {
      const classroomExist = await this.classroomRepository.existById(
        data.classroomId
      )
      if (!classroomExist) throw new ErrorResponse('classroom-not-exist')

      const teamExist = await this.teamRepository.existByIdAndClassroom(
        data.teamId,
        data.classroomId
      )
      if (!teamExist) throw new ErrorResponse('team-not-exist')

      const allAbilitiesExists =
        await this.abilityRepository.existAllByIdsAndClassroom(
          data.abilityIds,
          data.classroomId
        )
      if (!allAbilitiesExists)
        throw new ErrorResponse('not-all-abilities-exist')

      const newCharacter = await this.characterRepository.create(data)
      return CharacterMapper.toModel(newCharacter)
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public async updateCharacterById(
    characterId: string,
    updateData: Partial<UpdateCharacter>
  ): Promise<void> {
    try {
      const characterExist =
        await this.characterRepository.existById(characterId)
      if (!characterExist) throw new ErrorResponse('character-not-exist')

      const { classroomId, abilityIds, teamId, ...restData } = updateData
      const data: Partial<UpdateCharacter> = { ...restData }

      if (classroomId) {
        const classroomExist =
          await this.classroomRepository.existById(classroomId)
        if (!classroomExist) throw new ErrorResponse('classroom-not-exist')
        data.classroomId = classroomId
      }

      if (teamId) {
        const teamExist = await this.teamRepository.existById(teamId)
        if (!teamExist) throw new ErrorResponse('team-not-exist')
        data.teamId = teamId
      }

      if (abilityIds) {
        const allAbilitiesExists =
          await this.abilityRepository.existAllByIds(abilityIds)
        if (!allAbilitiesExists)
          throw new ErrorResponse('not-all-abilities-exist')
        data.abilityIds = abilityIds
      }

      await this.characterRepository.updateById(characterId, data)
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }

  public async deleteCharacterById(
    characterId: string,
    classroomId: string
  ): Promise<void> {
    try {
      const classroomExist =
        await this.classroomRepository.existById(classroomId)
      if (!classroomExist) throw new ErrorResponse('classroom-not-exist')

      const characterExist =
        await this.characterRepository.existByIdAndClassroom(
          characterId,
          classroomId
        )
      if (!characterExist) throw new ErrorResponse('character-not-exist')

      const charactersCount =
        await this.characterRepository.countByClassroomId(classroomId)
      if (charactersCount === 2)
        throw new ErrorResponse('delete-character-not-allowed')

      await this.characterRepository.deleteById(characterId)
    } catch (err) {
      const error = err as ErrorResponse | FirestoreError
      throw new ErrorResponse(error.code)
    }
  }
}
