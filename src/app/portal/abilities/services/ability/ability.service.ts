import { Injectable, inject } from '@angular/core'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { AbilityMapper } from '~/abilities/mappers/ability.mapper'
import { AbilityModel } from '~/abilities/models/Ability.model'
import { AbilityRepository } from '~/abilities/repositories/ability.repository'

@Injectable({ providedIn: 'root' })
export class AbilityService {
  private readonly abilityRepository = inject(AbilityRepository)

  public async getAbilityByIdAsync(abilityId: string): Promise<AbilityModel> {
    const ability = await this.abilityRepository.getByIdAsync(abilityId)
    if (ability === null) throw new ErrorResponse('ability-not-exist')
    return AbilityMapper.toModel(ability)
  }
}
