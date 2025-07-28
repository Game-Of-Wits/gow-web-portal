import { Injectable, inject } from '@angular/core'
import { FirebaseError } from '@angular/fire/app'
import { FirestoreError } from '@angular/fire/firestore'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { catchError, map, Observable } from 'rxjs'
import { AbilityMapper } from '~/abilities/mappers/ability.mapper'
import { AbilityModel } from '~/abilities/models/Ability.model'
import { AbilityService } from '~/abilities/services/ability/ability.service'
import { LevelMapper } from '~/levels/mappers/level.mapper'
import { CreateLevelModel } from '~/levels/models/CreateLevel.model'
import { LevelModel } from '~/levels/models/Level.model'
import { LevelRepository } from '~/levels/repositories/level.repository'

@Injectable({ providedIn: 'root' })
export class LevelService {
  private readonly abilityService = inject(AbilityService)

  private readonly levelRepository = inject(LevelRepository)

  public getAllLevelsByClassroom(
    classroomId: string
  ): Observable<LevelModel[]> {
    return this.levelRepository.getAllByClassroomId(classroomId).pipe(
      map(levels => LevelMapper.toListModel(levels)),
      catchError(err => {
        const error = err as FirestoreError
        throw new ErrorResponse(error.code)
      })
    )
  }

  public getAllAbilitiesFromLevel(levelId: string): Observable<AbilityModel[]> {
    return new Observable<AbilityModel[]>(observer => {
      this.levelRepository
        .getAllAbilitiesFromLevelIdAsync(levelId)
        .then(abilities => {
          observer.next(AbilityMapper.toListModel(abilities))
          observer.complete()
        })
        .catch(error => {
          observer.error(new ErrorResponse(error.code))
        })
    })
  }

  public async createLevel(data: CreateLevelModel): Promise<LevelModel> {
    const newLevel = await this.levelRepository.create(data)
    return LevelMapper.toModel(newLevel)
  }

  public async removeAbilityFromLevelAsync(
    levelId: string,
    abilityId: string
  ): Promise<void> {
    try {
      const level = await this.levelRepository.getByIdAsync(levelId)

      if (level === null) throw new ErrorResponse('level-not-exist')

      const updatedLevelAbilities = level.abilities.filter(
        abilityRef => abilityRef.id !== abilityId
      )

      await this.levelRepository.updateByIdAsync(abilityId, {
        abilities: updatedLevelAbilities
      })
    } catch (err) {
      const error = err as FirebaseError
      throw new ErrorResponse(error.code)
    }
  }

  public async addAbilityToLevelAsync(
    levelId: string,
    abilityId: string
  ): Promise<AbilityModel> {
    const level = await this.levelRepository.getByIdAsync(levelId)

    if (level === null) throw new ErrorResponse('level-not-exist')

    const ability = await this.abilityService.getAbilityByIdAsync(abilityId)

    if (ability === null) throw new ErrorResponse('ability-not-exist')

    await this.levelRepository.updateByIdAsync(level.id, {
      abilities: level?.abilities.filter(a => a.id !== abilityId)
    })

    return ability
  }
}
