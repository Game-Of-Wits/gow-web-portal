import {
  AbilityActionModel,
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
  AbilityActionFormData,
  AscensionActionFormData,
  ClassroomActionFormData,
  DeferealHomeworkActionFormData,
  HealthActionFormData,
  RevealActionFormData,
  ReviveActionFormData,
  TheftActionFormData
} from '../models/AbilityFormData.model'
import { DiscoveryInformation } from '../models/DiscoveryInformation.model'

export class AbilityActionFormMapper {
  static toModel(action: AbilityActionFormData): AbilityActionModel {
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
  }

  static toForm(action: AbilityActionModel): AbilityActionFormData {
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
  }
}
