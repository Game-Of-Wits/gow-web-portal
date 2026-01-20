import { Component, computed, inject, OnInit, signal } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { LucideAngularModule, Plus } from 'lucide-angular'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { AbilityModel } from '~/abilities/models/Ability.model'
import { ClassroomAdminPanelLoadingComponent } from '~/classrooms/components/ui/classroom-admin-panel-loading.component'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import {
  LevelFormDialogComponent,
  LevelFormSubmit
} from '~/levels/components/level-form-dialog/level-form-dialog.component'
import { LevelItemDropdownComponent } from '~/levels/components/level-item-dropdown/level-item-dropdown.component'
import { levelForm } from '~/levels/forms'
import { LevelModel } from '~/levels/models/Level.model'
import { LevelForm } from '~/levels/models/LevelForm.model'
import { LevelService } from '~/levels/services/level/level.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { ErrorMessages } from '~/shared/types/ErrorMessages'

const deleteLevelErrorMessages: ErrorMessages = {
  'level-not-exist': {
    message: 'Nivel no existente',
    summary: 'El nivel no ha sido encontrado'
  },
  'delete-initial-level-not-allowed': {
    message: 'Eliminar nivel inicial no ',
    summary: 'El nivel inicial no se puede eliminar'
  },
  ...commonErrorMessages
}

const createLevelErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

const updateLevelErrorMessages: ErrorMessages = {
  'level-not-exist': {
    message: 'Nivel no existente',
    summary: 'El nivel no ha sido encontrado'
  },
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
    LevelFormDialogComponent,
    ClassroomAdminPanelLoadingComponent,
    ConfirmDialogModule,
    LucideAngularModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class ClassroomAdminPanelLevelsPageComponent implements OnInit {
  public readonly addIcon = Plus

  private readonly levelService = inject(LevelService)

  private readonly classroomContext = inject(ClassroomAdminPanelContextService)
  private readonly confirmationService = inject(ConfirmationService)
  private readonly toastService = inject(MessageService)

  public levels = signal<LevelModel[]>([])
  public isLevelsLoading = signal<boolean>(true)

  public loadLevelAbilitiesMap = signal<Map<string, AbilityModel[]>>(new Map())
  public isCreateLevelLoading = signal<boolean>(false)
  public deletingLevelLoading = signal<boolean>(false)

  public showCreateLevelFormDialog = signal<boolean>(false)
  public showEditLevelFormDialog = signal<boolean>(false)

  public levelSelected = signal<{
    id: number | string
    form: FormGroup<LevelForm> | null
    minPoints: number
    maxPoints: number | null
  }>({
    id: 0,
    form: null,
    minPoints: 0,
    maxPoints: null
  })

  public hasActiveAcademicPeriod = computed(
    () => this.classroomContext.activeAcademicPeriod() !== null
  )

  public disableActions = computed(
    () => this.hasActiveAcademicPeriod() || this.deletingLevelLoading()
  )

  ngOnInit(): void {
    const classroomId = this.classroomContext.classroom()?.id ?? null

    if (classroomId === null) return

    this.loadLevels(classroomId)
  }

  public onCloseLevelFormDialog() {
    this.showCreateLevelFormDialog.set(false)
    this.showEditLevelFormDialog.set(false)
    this.levelSelected.set({
      id: 0,
      form: null,
      minPoints: 0,
      maxPoints: null
    })
  }

  public onOpenCreateLevelDialog(nextLevelPosition: number) {
    let minPoints = 0
    let maxPoints: number | null = null

    minPoints = (this.levels()[nextLevelPosition - 1]?.requiredPoints ?? 0) + 1

    maxPoints = this.levels()[nextLevelPosition]?.requiredPoints ?? null

    if (maxPoints !== null) maxPoints -= 1

    this.levelSelected.set({
      id: nextLevelPosition,
      form: levelForm({
        requiredPoints: minPoints,
        max: maxPoints
      }),
      minPoints,
      maxPoints
    })
    this.showCreateLevelFormDialog.set(true)
  }

  public onOpenEditLevelDialog(levelId: string) {
    const level = this.levels().find(level => level.id === levelId)

    if (level === undefined) return

    let minPoints = 0
    let maxPoints: number | null = null

    const levelPosition = this.levels().findIndex(l => l.id === level.id)

    minPoints =
      levelPosition === 0
        ? 0
        : (this.levels()[levelPosition - 1]?.requiredPoints ?? 0) + 1
    maxPoints = this.levels()[levelPosition + 1]?.requiredPoints ?? null

    if (maxPoints !== null) maxPoints -= 1

    this.levelSelected.set({
      id: level.id,
      form: levelForm({
        requiredPoints: level.requiredPoints,
        max: maxPoints,
        name: level.name,
        primaryColor: level.primaryColor
      }),
      minPoints,
      maxPoints
    })
    this.showEditLevelFormDialog.set(true)
  }

  public onCreateLevel(submit: LevelFormSubmit) {
    const classroomId = this.classroomContext.classroom()?.id ?? null

    if (classroomId === null) return

    this.isCreateLevelLoading.set(true)

    this.levelService
      .createLevel({ classroomId, ...submit.result.formData })
      .then(level => {
        this.levels.update(levels => {
          const updatedLevels = [...levels]

          updatedLevels.splice(submit.result.id as number, 0, level)

          return updatedLevels
        })
        submit.onFinish()
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showCreateLevelErrorMessage(error.code)
      })
      .finally(() => {
        this.isCreateLevelLoading.set(false)
      })
  }

  public onEditLevel(submit: LevelFormSubmit) {
    const classroomId = this.classroomContext.classroom()?.id ?? null

    if (classroomId === null) return

    const levelId = submit.result.id as string
    const updateData = submit.result.formData

    this.isCreateLevelLoading.set(true)

    this.levelService
      .updateLevelById(levelId, updateData)
      .then(() => {
        this.levels.update(levels => {
          const levelIndex = levels.findIndex(
            level => level.id === submit.result.id
          )
          if (levelIndex === -1) return levels

          const formData = submit.result.formData

          levels[levelIndex] = {
            ...levels[levelIndex],
            requiredPoints: formData.requiredPoints,
            primaryColor: formData.primaryColor.trim(),
            name: formData.name.trim()
          }

          return levels
        })
        submit.onFinish()
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showUpdateLevelErrorMessage(error.code)
      })
      .finally(() => {
        this.isCreateLevelLoading.set(false)
      })
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

  public isValidCreateLevelBetweenLevels(
    currentRequiredPoints: number,
    nextRequiredPoints: number | null
  ) {
    if (nextRequiredPoints === null) return true

    return nextRequiredPoints - currentRequiredPoints > 1
  }

  public onDeleteLevel(data: { event: Event; levelId: string }) {
    this.confirmationService.confirm({
      target: data.event.target as EventTarget,
      message: '¿Estas seguro de eliminar el nivel?',
      header: 'Eliminar nivel',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
        loading: this.deletingLevelLoading()
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
        loading: this.deletingLevelLoading()
      },
      accept: async () => {
        this.deletingLevelLoading.set(true)

        try {
          await this.levelService.deleteLevelById(data.levelId)
          this.levels.update(levels =>
            levels.filter(level => level.id !== data.levelId)
          )
        } catch (err) {
          const error = err as ErrorResponse
          this.showDeleteLevelErrorMessage(error.code)
        } finally {
          this.deletingLevelLoading.set(false)
        }
      }
    })
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
        this.showLevelsLoadingErrorMessage(error.code)
      }
    })
  }

  private showDeleteLevelErrorMessage(code: string) {
    const { summary, message } = deleteLevelErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showUpdateLevelErrorMessage(code: string) {
    const { summary, message } = updateLevelErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showCreateLevelErrorMessage(code: string) {
    const { summary, message } = createLevelErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showLevelsLoadingErrorMessage(code: string) {
    const { summary, message } = levelsLoadingErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showErrorMessage(summary: string, detail: string) {
    this.toastService.add({ severity: 'error', summary, detail })
  }
}
