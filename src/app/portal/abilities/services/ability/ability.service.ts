import { Injectable, inject } from '@angular/core'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { AbilityMapper } from '~/abilities/mappers/ability.mapper'
import { AbilityModel } from '~/abilities/models/Ability.model'
import { AbilityRepository } from '~/abilities/repositories/ability.repository'
import { ClassroomsService } from '~/classrooms/services/classrooms/classrooms.service'
import { EducationalExperience } from '~/shared/models/EducationalExperience'

@Injectable({ providedIn: 'root' })
export class AbilityService {
  private readonly classroomService = inject(ClassroomsService)

  private readonly abilityRepository = inject(AbilityRepository)

  public async getAbilityByIdAsync(abilityId: string): Promise<AbilityModel> {
    const ability = await this.abilityRepository.getByIdAsync(abilityId)
    if (ability === null) throw new ErrorResponse('ability-not-exist')
    return AbilityMapper.toModel(ability)
  }

  public async getAllAbilitiesByClassroomAndExperienceAsync(
    classroomId: string,
    experience: EducationalExperience
  ): Promise<AbilityModel[]> {
    const classroom =
      await this.classroomService.getClassroomByIdAsync(classroomId)

    if (classroom === null) throw new ErrorResponse('classroom-not-exist')

    const abilities =
      await this.abilityRepository.getAllByClassroomIdAndExperienceAsync(
        classroom.id,
        experience
      )

    return AbilityMapper.toListModel(abilities)
  }
}
