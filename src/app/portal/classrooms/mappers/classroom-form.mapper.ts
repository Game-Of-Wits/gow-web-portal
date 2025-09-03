import { AbilityFormMapper } from '~/abilities/mappers/ability-form.mapper'
import { CreateClassroom } from '../models/CreateClassroom.model'
import { CreateClassroomFormData } from '../models/CreateClassroomFormData.model'

export class ClassroomFormMapper {
  static toCreate(
    schoolId: string,
    teacherId: string,
    form: CreateClassroomFormData
  ): CreateClassroom {
    const { experiences, ...formData } = form

    const masteryRoadExperience = experiences.MASTERY_ROAD
    const shadowWarfareExperience = experiences.SHADOW_WARFARE

    return {
      ...formData,
      schoolId,
      teacherId,
      experiences: {
        MASTERY_ROAD: masteryRoadExperience,
        SHADOW_WARFARE: {
          character: shadowWarfareExperience.character,
          teams: shadowWarfareExperience.teams,
          initialAbilities: shadowWarfareExperience.initialAbilities.map(
            ability => AbilityFormMapper.toCreateInitial(ability)
          ),
          initialCharacters: shadowWarfareExperience.initialCharacters
        }
      }
    }
  }
}
