import { Component, inject, OnInit, signal } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { LucideAngularModule, Plus } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { AbilityModel } from '~/abilities/models/Ability.model'
import { ClassroomAdminPanelLoadingComponent } from '~/classrooms/components/ui/classroom-admin-panel-loading.component'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { AddAbilityToLevelDialogComponent } from '~/levels/components/add-ability-to-level-dialog/add-ability-to-level-dialog.component'
import { LevelFormDialogComponent } from '~/levels/components/level-form-dialog/level-form-dialog.component'
import { LevelItemDropdownComponent } from '~/levels/components/level-item-dropdown/level-item-dropdown.component'
import { LevelModel } from '~/levels/models/Level.model'
import { LevelForm } from '~/levels/models/LevelForm.model'
import { LevelService } from '~/levels/services/level/level.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { ErrorMessages } from '~/shared/types/ErrorMessages'

const createLevelErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

const levelsLoadingErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

@Component({
  selector: 'gow-classroom-admin-panel-levels',
  templateUrl: './classroom-admin-panel-levels.component.html',
  imports: [
    LevelItemDropdownComponent,
    ButtonModule,
    CardModule,
    AddAbilityToLevelDialogComponent,
    LevelFormDialogComponent,
    ClassroomAdminPanelLoadingComponent,
    LucideAngularModule
  ],
  providers: [MessageService]
})
export class ClassroomAdminPanelLevelsPageComponent implements OnInit {
  public readonly addIcon = Plus

  private readonly levelService = inject(LevelService)

  private readonly context = inject(ClassroomAdminPanelContextService)
  private readonly toastService = inject(MessageService)

  public levels = signal<LevelModel[]>([])
  public isLevelsLoading = signal<boolean>(true)

  public levelIdSelectedToAddAbility = signal<string | null>(null)
  public showAddAbilityToLevelDialog = signal<boolean>(false)

  public loadLevelAbilitiesMap = signal<Map<string, AbilityModel[]>>(new Map())
  public isCreateLevelLoading = signal<boolean>(false)

  public showCreateLevel = signal<boolean>(false)
  public createLevelData = signal<{
    position: number
    minPoints: number
    maxPoints: number | null
  }>({
    position: 0,
    minPoints: 0,
    maxPoints: null
  })

  ngOnInit(): void {
    const classroomId = this.context.classroom()?.id ?? null

    if (classroomId === null) return

    this.loadLevels(classroomId)
  }

  public onOpenCreateLevelDialog(position: number) {
    let minPoints = 0
    let maxPoints: number | null = null

    minPoints = (this.levels().at(position - 1)?.requiredPoints ?? 0) + 1

    maxPoints = this.levels().at(position)?.requiredPoints ?? null

    this.showCreateLevel.set(true)
    this.createLevelData.set({
      position,
      minPoints,
      maxPoints
    })
  }

  public onCloseAddLevelDialog() {
    this.showCreateLevel.set(false)
  }

  public onCreateLevel(data: { position: number; form: FormGroup<LevelForm> }) {
    const classroomId = this.context.classroom()?.id ?? null

    if (data.form.invalid || classroomId === null) return

    const levelData = data.form.getRawValue()

    this.isCreateLevelLoading.set(true)

    this.levelService
      .createLevel({ classroomId, ...levelData })
      .then(level => {
        this.levels.update(levels => {
          const updatedLevels = [...levels]

          updatedLevels.splice(data.position, 0, level)

          return updatedLevels
        })
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.onShowCreateLevelErrorMessage(error.code)
      })
      .finally(() => {
        this.isCreateLevelLoading.set(false)
      })
  }

  public onCloseAddAbilityToLevelDialog() {
    this.showAddAbilityToLevelDialog.set(false)
    this.levelIdSelectedToAddAbility.set(null)
  }

  public onOpenAddAbilityToLevelDialog(levelId: string) {
    this.showAddAbilityToLevelDialog.set(true)
    this.levelIdSelectedToAddAbility.set(levelId)
  }

  public onUpdateLoadLevelAbilities(data: {
    levelId: string
    abilities: AbilityModel[]
  }) {
    this.loadLevelAbilitiesMap.update(currentMap => {
      currentMap.set(data.levelId, data.abilities)
      return currentMap
    })
  }

  public onAddAbilityToLoadLevelAbilities(data: {
    levelId: string
    abilityAdded: AbilityModel
  }) {
    this.loadLevelAbilitiesMap.update(currentMap => {
      const newMap = new Map(currentMap)
      if (!newMap.has(data.levelId)) return newMap

      const currentAbilities = newMap.get(data.levelId)!
      newMap.set(data.levelId, [...currentAbilities, data.abilityAdded])
      return newMap
    })
  }

  public isValidCreateLevelBetweenLevels(
    currentRequiredPoints: number,
    nextRequiredPoints: number | null
  ) {
    if (nextRequiredPoints === null) return true

    return nextRequiredPoints - currentRequiredPoints > 1
  }

  private loadLevels(classroomId: string) {
    this.isLevelsLoading.set(true)

    this.levelService.getAllLevelsByClassroom(classroomId).subscribe({
      next: levels => {
        this.levels.set(levels)
        this.isLevelsLoading.set(false)
      },
      error: err => {
        const error = err as ErrorResponse
        this.onShowLevelsLoadingErrorMessage(error.code)
      }
    })
  }

  private onShowCreateLevelErrorMessage(code: string) {
    const { summary, message } = createLevelErrorMessages[code]
    this.onShowErrorMessage(summary, message)
  }

  private onShowLevelsLoadingErrorMessage(code: string) {
    const { summary, message } = levelsLoadingErrorMessages[code]
    this.onShowErrorMessage(summary, message)
  }

  private onShowErrorMessage(summary: string, detail: string) {
    this.toastService.add({ severity: 'error', summary, detail })
  }
}
