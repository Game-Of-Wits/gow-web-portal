import { AbilityActionModel, RevealActionModel } from '../models/Ability.model'
import { AbilityActionType } from '../models/AbilityActionType.model'
import {
  AbilityActionFormData,
  RevealActionFormData
} from '../models/AbilityFormData.model'
import { DiscoveryInformation } from '../models/DiscoveryInformation.model'

export class AbilityActionFormMapper {
  static toModel(action: AbilityActionFormData): AbilityActionModel {
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
        target: action.target,
        maxTargets: action.maxTargets
      } as RevealActionModel
    }

    return action as AbilityActionModel
  }

  static toForm(action: AbilityActionModel): AbilityActionFormData {
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
        target: action.target,
        maxTargets: action.maxTargets
      } as RevealActionFormData
    }

    return action as AbilityActionFormData
  }
}
