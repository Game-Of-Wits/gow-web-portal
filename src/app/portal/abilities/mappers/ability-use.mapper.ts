import { Injectable, inject } from '@angular/core'
import { StudentProfileService } from '~/student-profiles/services/student-profile/student-profile.service'
import { StudentService } from '~/students/services/student/student.service'
import { AbilityUseModel } from '../models/AbilityUse.model'
import { AbilityUseDbModel } from '../models/AbilityUseDb.model'
import { AbilityService } from '../services/ability/ability.service'

@Injectable({ providedIn: 'root' })
export class AbilityUseMapper {
  private readonly studentService = inject(StudentService)
  private readonly studentProfileService = inject(StudentProfileService)
  private readonly abilityService = inject(AbilityService)

  public async toModel(
    abilityUse: AbilityUseDbModel
  ): Promise<AbilityUseModel> {
    const student = await this.studentService.getStudentByIdAsync(
      abilityUse.studentId
    )
    const studentProfile =
      await this.studentProfileService.getStudentProfileByIdAsync(
        student.profileId
      )
    const ability = await this.abilityService.getAbilityByIdAsync(
      abilityUse.abilityId
    )

    return {
      student: {
        firstName: studentProfile.firstName,
        lastName: studentProfile.lastName
      },
      abilityName: ability.name,
      createdAt: new Date(abilityUse.createdAt),
      characterId: abilityUse.characterId
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
