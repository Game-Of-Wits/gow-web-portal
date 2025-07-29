import { Component, OnInit, signal } from '@angular/core'
import { LucideAngularModule, Pencil, Sparkle, Trash2 } from 'lucide-angular'
import { ButtonModule } from 'primeng/button'
import { TableModule } from 'primeng/table'
import {
  abilityActionTypeFormats,
  abilityTypeFormats,
  abilityUsageFormats
} from '~/abilities/data/formats'
import { AbilityModel } from '~/abilities/models/Ability.model'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AbilityType } from '~/abilities/models/AbilityType.model'
import { AbilityUsage } from '~/abilities/models/AbilityUsage.model'
import { educationalExperienceFormats } from '~/shared/data/educationalExperienceFormats'
import { EducationalExperience } from '~/shared/models/EducationalExperience'

@Component({
  selector: 'gow-classroom-admin-panel-abilities',
  templateUrl: './classroom-admin-panel-abilities.component.html',
  imports: [TableModule, ButtonModule, LucideAngularModule]
})
export class ClassroomAdminPanelAbiltiesPageComponent implements OnInit {
  public readonly addIcon = Sparkle
  public readonly deleteIcon = Trash2
  public readonly editIcon = Pencil

  public readonly abilityType = AbilityType

  public abilities = signal<AbilityModel[]>([])
  public isAbilitiesLoading = signal<boolean>(true)

  ngOnInit(): void {}

  public getAbilityTypeFormat(type: any) {
    return abilityTypeFormats[type as AbilityType]
  }

  public getEducationalExperienceFormat(type: any) {
    return educationalExperienceFormats[type as EducationalExperience]
  }

  public getAbilityUsageTypeFormat(type: any) {
    return abilityUsageFormats[type as AbilityUsage]
  }

  public getAbilityActionTypeFormat(type: any) {
    return abilityActionTypeFormats[type as AbilityActionType]
  }
}
