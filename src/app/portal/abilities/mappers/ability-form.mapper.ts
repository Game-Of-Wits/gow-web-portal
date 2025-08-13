import {
  AbilityModel,
  AscensionActionModel,
  ClassroomActionModel,
  DeferealHomeworkActionModel,
  HealthActionModel,
  RevealActionModel,
  ReviveActionModel,
  TheftActionModel
} from '../models/Ability.model'
import { AbilityActionType } from '../models/AbilityActionType.model'
import {
  AbilityFormData,
  AscensionActionFormData,
  ClassroomActionFormData,
  DeferealHomeworkActionFormData,
  HealthActionFormData,
  RevealActionFormData,
  ReviveActionFormData,
  TheftActionFormData
} from '../models/AbilityFormData.model'
import { AbilityUsage } from '../models/AbilityUsage.model'
import { DiscoveryInformation } from '../models/DiscoveryInformation.model'

export class AbilityFormMapper {
  static toModel(form: AbilityFormData): Omit<AbilityModel, 'id'> {
    const { actions, usage, ...abilityData } = form

    if (usage.type === AbilityUsage.ONE_TIME) delete usage.interval

    const abilityActions = actions.map(action => {
      if (action.type === AbilityActionType.THEFT)
        return action as TheftActionModel
      if (action.type === AbilityActionType.HEALTH)
        return action as HealthActionModel
      if (action.type === AbilityActionType.REVEAL) {
        const actionInformation = Object.entries(action.information).reduce(
          (arr, value) => {
            const [information, isSelected] = value
            if (isSelected) arr.push(information as DiscoveryInformation)
            return arr
          },
          [] as DiscoveryInformation[]
        )

        return {
          information: actionInformation,
          type: AbilityActionType.REVEAL,
          target: action.target
        } as RevealActionModel
      }
      if (action.type === AbilityActionType.REVIVE)
        return action as ReviveActionModel
      if (action.type === AbilityActionType.ASCENSION)
        return action as AscensionActionModel
      if (action.type === AbilityActionType.DEFEREAL_HOMEWORK)
        return action as DeferealHomeworkActionModel
      return action as ClassroomActionModel
    })

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

    const abilityActions = actions.map(action => {
      if (action.type === AbilityActionType.THEFT)
        return action as TheftActionFormData
      if (action.type === AbilityActionType.HEALTH)
        return action as HealthActionFormData
      if (action.type === AbilityActionType.REVEAL) {
        const actionInformation: Record<DiscoveryInformation, boolean> = {
          [DiscoveryInformation.CHARACTER]: false,
          [DiscoveryInformation.ABILITIES]: false,
          [DiscoveryInformation.TEAM]: false
        }

        action.information.forEach(info => {
          actionInformation[info] = true
        })

        return {
          information: actionInformation,
          type: AbilityActionType.REVEAL,
          target: action.target
        } as RevealActionFormData
      }
      if (action.type === AbilityActionType.REVIVE)
        return action as ReviveActionFormData
      if (action.type === AbilityActionType.ASCENSION)
        return action as AscensionActionFormData
      if (action.type === AbilityActionType.DEFEREAL_HOMEWORK)
        return action as DeferealHomeworkActionFormData
      return action as ClassroomActionFormData
    })

    return {
      ...abilityData,
      actions: abilityActions
    }
  }
}
