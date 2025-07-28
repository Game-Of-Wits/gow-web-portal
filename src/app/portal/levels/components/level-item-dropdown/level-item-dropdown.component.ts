import { Component, input, output, signal } from '@angular/core'
import {
  ChevronDown,
  ChevronUp,
  LucideAngularModule,
  Pencil,
  Trash2
} from 'lucide-angular'
import { ButtonModule } from 'primeng/button'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { TagModule } from 'primeng/tag'
import { AbilityModel } from '~/abilities/models/Ability.model'
import { LevelModel } from '~/levels/models/Level.model'
import { LevelAbilityListComponent } from '../level-ability-list/level-ability-list.component'

@Component({
  selector: 'gow-level-item-dropdown',
  templateUrl: './level-item-dropdown.component.html',
  imports: [
    LevelAbilityListComponent,
    TagModule,
    ButtonModule,
    ProgressSpinnerModule,
    LucideAngularModule
  ]
})
export class LevelItemDropdownComponent {
  public readonly deleteIcon = Trash2
  public readonly editIcon = Pencil
  public readonly downIcon = ChevronDown
  public readonly upIcon = ChevronUp

  public level = input.required<LevelModel>({ alias: 'level' })
  public loadLevelAbilities = input.required<AbilityModel[] | null>({
    alias: 'loadLevelAbilities'
  })

  public isLevelAbilitiesShowing = signal<boolean>(false)

  public onSelectLevelToAddAbility = output<string>({
    alias: 'selectLevelToAddAbility'
  })
  public onUploadLoadLevelAbilities = output<{
    levelId: string
    abilities: AbilityModel[]
  }>({ alias: 'uploadLoadLevelAbilities' })

  public onToggleShowAbilities() {
    this.isLevelAbilitiesShowing.update(value => !value)
  }

  public onSetLevelAbilities(abilities: AbilityModel[]) {
    this.onUploadLoadLevelAbilities.emit({
      levelId: this.level().id,
      abilities
    })
  }

  public onSetSelectLevelToAddAbility(levelId: string) {
    this.onSelectLevelToAddAbility.emit(levelId)
  }
}
