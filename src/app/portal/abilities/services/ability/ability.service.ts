import { Injectable, inject } from '@angular/core'
import { FirebaseError } from '@angular/fire/app'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { AbilityMapper } from '~/abilities/mappers/ability.mapper'
import { AbilityModel } from '~/abilities/models/Ability.model'
import { AbilityUsage } from '~/abilities/models/AbilityUsage.model'
import { CreateAbility } from '~/abilities/models/CreateAbility.model'
import { UpdateAbility } from '~/abilities/models/UpdateAbility.model'
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
    try {
      const classroom =
        await this.classroomService.getClassroomByIdAsync(classroomId)

      if (classroom === null) throw new ErrorResponse('classroom-not-exist')

      const abilities =
        await this.abilityRepository.getAllByClassroomIdAndExperienceAsync(
          classroom.id,
          experience
        )

      return AbilityMapper.toListModel(abilities)
    } catch (err) {
      const error = err as FirebaseError | ErrorResponse
      throw new ErrorResponse(error.code)
    }
  }

  public async getAllAbilitiesByClassroomAsync(
    classroomId: string
  ): Promise<AbilityModel[]> {
    try {
      const classroom =
        await this.classroomService.getClassroomByIdAsync(classroomId)

      if (classroom === null) throw new ErrorResponse('classroom-not-exist')

      const abilities = await this.abilityRepository.getAllByClassroomIdAsync(
        classroom.id
      )

      return AbilityMapper.toListModel(abilities)
    } catch (err) {
      const error = err as FirebaseError | ErrorResponse
      throw new ErrorResponse(error.code)
    }
  }

  public async createAbility(data: CreateAbility): Promise<AbilityModel> {
    try {
      const classroom = await this.classroomService.getClassroomByIdAsync(
        data.classroomId
      )

      if (classroom === null) throw new ErrorResponse('classroom-not-exist')

      const abilityData = structuredClone(data)

      if (abilityData.experience === EducationalExperience.MASTERY_ROAD) {
        delete abilityData.usage.interval
        delete abilityData.usage.shift
      }

      const newAbility = await this.abilityRepository.create(abilityData)

      return AbilityMapper.toModel(newAbility)
    } catch (err) {
      const error = err as FirebaseError | ErrorResponse
      throw new ErrorResponse(error.code)
    }
  }

  public async updateAbilityById(
    abilityId: string,
    data: Partial<UpdateAbility>
  ): Promise<void> {
    try {
      const abilityExists = await this.abilityRepository.existById(abilityId)

      if (!abilityExists) throw new ErrorResponse('ability-not-exist')

      if (data.classroomId !== undefined) {
        const classroomExists = await this.classroomService.classroomExistsById(
          data.classroomId
        )
        if (!classroomExists) throw new ErrorResponse('classroom-not-exist')
      }

      const updateAbilityData = structuredClone(data)

      if (data.usage?.type === AbilityUsage.ONE_TIME)
        delete updateAbilityData.usage?.interval

      await this.abilityRepository.updateById(abilityId, updateAbilityData)
    } catch (err) {
      const error = err as FirebaseError | ErrorResponse
      throw new ErrorResponse(error.code)
    }
  }

  public async deleteAbilityById(abilityId: string) {
    try {
      const abilityExists = await this.abilityRepository.existById(abilityId)

      if (!abilityExists) throw new ErrorResponse('ability-not-exist')

      await this.abilityRepository.deleteById(abilityId)
    } catch (err) {
      const error = err as FirebaseError | ErrorResponse
      throw new ErrorResponse(error.code)
    }
  }
}
