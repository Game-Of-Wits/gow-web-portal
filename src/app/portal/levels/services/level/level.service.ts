import { Injectable, inject } from '@angular/core'
import { FirebaseError } from '@angular/fire/app'
import { FirestoreError } from '@angular/fire/firestore'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { catchError, map, Observable, throwError } from 'rxjs'
import { AbilityMapper } from '~/abilities/mappers/ability.mapper'
import { AbilityModel } from '~/abilities/models/Ability.model'
import { AbilityService } from '~/abilities/services/ability/ability.service'
import { LevelMapper } from '~/levels/mappers/level.mapper'
import { CreateLevelModel } from '~/levels/models/CreateLevel.model'
import { LevelModel } from '~/levels/models/Level.model'
import { UpdateLevelModel } from '~/levels/models/UpdateLevel.model'
import { LevelRepository } from '~/levels/repositories/level.repository'

@Injectable({ providedIn: 'root' })
export class LevelService {
  private readonly abilityService = inject(AbilityService)

  private readonly levelRepository = inject(LevelRepository)

  public async getLevelByIdAsync(levelId: string): Promise<LevelModel> {
    try {
      const level = await this.levelRepository.getByIdAsync(levelId)

      if (level === null) throw new ErrorResponse('level-not-exist')

      return LevelMapper.toModel(level)
    } catch (err) {
      const error = err as FirebaseError | ErrorResponse
      throw new ErrorResponse(error.code)
    }
  }

  public getAllLevelsByClassroom(
    classroomId: string
  ): Observable<LevelModel[]> {
    return this.levelRepository.getAllByClassroomId(classroomId).pipe(
      map(levels => LevelMapper.toListModel(levels)),
      catchError(err => {
        if (err instanceof FirestoreError)
          return throwError(() => new ErrorResponse(err.code))
        return throwError(() => err)
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
    try {
      const newLevel = await this.levelRepository.create(data)
      return LevelMapper.toModel(newLevel)
    } catch (err) {
      const error = err as FirebaseError
      throw new ErrorResponse(error.code)
    }
  }

  public async updateLevelById(
    levelId: string,
    data: Partial<UpdateLevelModel>
  ): Promise<void> {
    try {
      const levelExists = await this.levelRepository.existsById(levelId)

      if (!levelExists) throw new ErrorResponse('level-not-exist')

      await this.levelRepository.updateByIdAsync(levelId, data)
    } catch (err) {
      const error = err as FirebaseError | ErrorResponse
      throw new ErrorResponse(error.code)
    }
  }

  public async deleteLevelById(levelId: string): Promise<void> {
    try {
      const level = await this.levelRepository.getByIdAsync(levelId)

      if (level === null) throw new ErrorResponse('level-not-exist')

      if (level.requiredPoints === 0)
        throw new ErrorResponse('delete-initial-level-not-allowed')

      await this.levelRepository.deleteByIdAsync(levelId)
    } catch (err) {
      const error = err as FirebaseError | ErrorResponse
      throw new ErrorResponse(error.code)
    }
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
        abilityIds: updatedLevelAbilities.map(ability => ability.id)
      })
    } catch (err) {
      const error = err as FirebaseError | ErrorResponse
      throw new ErrorResponse(error.code)
    }
  }

  public async addAbilityToLevelAsync(
    levelId: string,
    abilityId: string
  ): Promise<AbilityModel> {
    try {
      const level = await this.levelRepository.getByIdAsync(levelId)

      if (level === null) throw new ErrorResponse('level-not-exist')

      const ability = await this.abilityService.getAbilityByIdAsync(abilityId)

      if (ability === null) throw new ErrorResponse('ability-not-exist')

      const levelAbilities = level.abilities.map(ability => ability.id)

      const levelUpdatedAbilities = [...levelAbilities, ability.id]

      await this.levelRepository.updateByIdAsync(level.id, {
        abilityIds: levelUpdatedAbilities
      })

      return ability
    } catch (err) {
      const error = err as FirebaseError | ErrorResponse
      throw new ErrorResponse(error.code)
    }
  }
}
