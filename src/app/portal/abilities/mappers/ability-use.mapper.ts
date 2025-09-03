import { Injectable } from '@angular/core'
import { AbilityUseModel } from '../models/AbilityUse.model'
import { AbilityUseDbModel } from '../models/AbilityUseDb.model'

@Injectable({ providedIn: 'root' })
export class AbilityUseMapper {
  public async toModel(
    abilityUse: AbilityUseDbModel
  ): Promise<AbilityUseModel> {
    return {
      studentFullName: abilityUse.studentFullName,
      abilityId: abilityUse.abilityId,
      abilityName: abilityUse.abilityName,
      createdAt: new Date(abilityUse.createdAt),
      characterName: abilityUse.characterName
    }
  }

  public async toListModel(
    abilityUses: AbilityUseDbModel[]
  ): Promise<AbilityUseModel[]> {
    const results = await Promise.allSettled(
      abilityUses.map(state => this.toModel(state))
    )

    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<AbilityUseModel>).value)
  }
}
