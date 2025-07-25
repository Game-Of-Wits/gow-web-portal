import { Injectable, inject } from '@angular/core'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { map, Observable } from 'rxjs'
import { CharacterMapper } from '~/characters/mappers/character.mapper'
import { CharacterModel } from '~/characters/models/Character.model'
import { CharacterRepository } from '~/characters/repositories/character.repository'

@Injectable({ providedIn: 'root' })
export class CharacterService {
  private readonly characterRepository = inject(CharacterRepository)

  public async getCharacterByIdAsync(id: string): Promise<CharacterModel> {
    const character = await this.characterRepository.getByIdAsync(id)
    if (character === null) throw new ErrorResponse('character-not-exist')
    return CharacterMapper.toModel(character)
  }

  public getAllCharactersByClassroom(
    classroomId: string
  ): Observable<CharacterModel[]> {
    return this.characterRepository
      .getAllByClassroomId(classroomId)
      .pipe(map(characters => CharacterMapper.toListModel(characters)))
  }
}
