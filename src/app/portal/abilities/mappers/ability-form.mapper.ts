import { AbilityModel } from '../models/Ability.model'
import { AbilityFormData } from '../models/AbilityFormData.model'
import { AbilityUsage } from '../models/AbilityUsage.model'
import { CreateInitialAbility } from '../models/CreateInitialAbility.model'
import { InitialAbilityFormData } from '../models/InitialAbilityFormData.model'
import { AbilityActionFormMapper } from './ability-action-form.mapper'

export class AbilityFormMapper {
  static toModel(form: AbilityFormData): Omit<AbilityModel, 'id'> {
    const { actions, usage, ...abilityData } = form

    if (usage.type === AbilityUsage.ONE_TIME) delete usage.interval

    const abilityActions = actions.map(action =>
      AbilityActionFormMapper.toModel(action)
    )

    return {
      ...abilityData,
      name: abilityData.name.trim(),
      description: abilityData.description.trim(),
      actions: abilityActions,
      usage
    }
  }

  static toForm(ability: AbilityModel): AbilityFormData {
    const { actions, ...abilityData } = ability

    const abilityActions = actions.map(action =>
      AbilityActionFormMapper.toForm(action)
    )

    return {
      ...abilityData,
      actions: abilityActions
    }
  }

  static toCreateInitial(form: InitialAbilityFormData): CreateInitialAbility {
    const { actions, ...abilityData } = form

    const abilityActions = actions.map(action =>
      AbilityActionFormMapper.toModel(action)
    )

    return {
      ...abilityData,
      actions: abilityActions
    }
  }
}
