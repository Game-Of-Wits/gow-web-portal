import {
  Component,
  computed,
  Input,
  inject,
  input,
  output,
  signal
} from '@angular/core'
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
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { LevelModel } from '~/levels/models/Level.model'
import {
  AddAbilityToLevelDialogComponent,
  AddAbilityToLevelDialogSubmit
} from '../add-ability-to-level-dialog/add-ability-to-level-dialog.component'
import { LevelAbilityListComponent } from '../level-ability-list/level-ability-list.component'

@Component({
  selector: 'gow-level-item-dropdown',
  templateUrl: './level-item-dropdown.component.html',
  imports: [
    LevelAbilityListComponent,
    TagModule,
    ButtonModule,
    ProgressSpinnerModule,
    AddAbilityToLevelDialogComponent,
    LucideAngularModule
  ]
})
export class LevelItemDropdownComponent {
  public readonly deleteIcon = Trash2
  public readonly editIcon = Pencil
  public readonly downIcon = ChevronDown
  public readonly upIcon = ChevronUp

  private readonly classroomContext = inject(ClassroomAdminPanelContextService)

  public disable = input<boolean>(false, { alias: 'disable' })
  public level = input.required<LevelModel>({ alias: 'level' })

  @Input() loadLevelAbilitiesMap!: Map<string, AbilityModel[]>

  public showAddAbilityToLevelDialog = signal<boolean>(false)

  public onUploadLoadLevelAbilities = output<{
    levelId: string
    abilities: AbilityModel[]
  }>({ alias: 'uploadLoadLevelAbilities' })

  public onDeleteLevel = output<{ event: Event; levelId: string }>({
    alias: 'delete'
  })

  public onEditLevel = output<string>({
    alias: 'edit'
  })

  public isLevelAbilitiesShowing = signal<boolean>(false)

  public hasActiveAcademicPeriod = computed(
    () => this.classroomContext.activeAcademicPeriod() !== null
  )

  public onToggleShowAbilities() {
    this.isLevelAbilitiesShowing.update(value => !value)
  }

  public onSetLevelAbilities(abilities: AbilityModel[]) {
    this.onUploadLoadLevelAbilities.emit({
      levelId: this.level().id,
      abilities
    })
  }

  public onDelete(event: Event, levelId: string) {
    this.onDeleteLevel.emit({ event, levelId })
  }

  public onEdit(levelId: string) {
    this.onEditLevel.emit(levelId)
  }

  public onCloseAddAbilityToLevelDialog() {
    this.showAddAbilityToLevelDialog.set(false)
  }

  public onOpenAddAbilityToLevelDialog() {
    this.showAddAbilityToLevelDialog.set(true)
  }

  public onAddAbilityToLoadLevelAbilities(
    submit: AddAbilityToLevelDialogSubmit
  ) {
    const levelAbilities = this.loadLevelAbilitiesMap.get(this.level().id)

    if (levelAbilities === undefined) return

    this.onUploadLoadLevelAbilities.emit({
      levelId: this.level().id,
      abilities: [...levelAbilities, submit.result.abilityAdded]
    })

    submit.onFinish()
  }
}
