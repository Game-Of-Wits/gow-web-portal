import { Injectable } from '@angular/core'
import { StudentAbilityUsageModel } from '../models/StudentAbilityUsage.model'
import { StudentAbilityUsageDbModel } from '../models/StudentAbilityUsageDb.model'

@Injectable({ providedIn: 'root' })
export class StudentAbilityUsageMapper {
  static async toModel(
    studentAbilityUsage: StudentAbilityUsageDbModel
  ): Promise<StudentAbilityUsageModel> {
    return {
      id: studentAbilityUsage.id,
      characterName: studentAbilityUsage.characterName,
      experienceSessionId: studentAbilityUsage.experienceSession.id,
      studentAbilityId: studentAbilityUsage.studentAbility.id,
      abilityId: studentAbilityUsage.ability.id,
      abilityName: studentAbilityUsage.abilityName,
      studentFullName: studentAbilityUsage.studentFullName,
      usageAt: studentAbilityUsage.usageAt.toDate()
    }
  }

  static async toListModel(
    studentAbilityUsages: StudentAbilityUsageDbModel[]
  ): Promise<StudentAbilityUsageModel[]> {
    const results = await Promise.allSettled(
      studentAbilityUsages.map(state => this.toModel(state))
    )

    return results
      .filter(result => result.status === 'fulfilled')
      .map(
        result =>
          (result as PromiseFulfilledResult<StudentAbilityUsageModel>).value
      )
  }
}
