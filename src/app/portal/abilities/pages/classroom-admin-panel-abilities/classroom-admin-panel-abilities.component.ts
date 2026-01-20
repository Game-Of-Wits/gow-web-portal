import { Component, computed, inject, OnInit, signal } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { LucideAngularModule, Pencil, Plus, Trash2 } from 'lucide-angular'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { TableModule } from 'primeng/table'
import { Toast } from 'primeng/toast'
import {
  AbilityFormDialogComponent,
  AbilityFormSubmit
} from '~/abilities/components/ability-form-dialog/ability-form-dialog.component'
import {
  abilityActionTypeFormats,
  abilityTypeFormats,
  abilityUsageFormats
} from '~/abilities/data/formats'
import { fullAbilityForm } from '~/abilities/forms/fullAbilityForm'
import { AbilityFormMapper } from '~/abilities/mappers/ability-form.mapper'
import { AbilityModel } from '~/abilities/models/Ability.model'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AbilityForm } from '~/abilities/models/AbilityForm.model'
import { AbilityType } from '~/abilities/models/AbilityType.model'
import { AbilityUsage } from '~/abilities/models/AbilityUsage.model'
import { AbilityService } from '~/abilities/services/ability/ability.service'
import { ClassroomAdminPanelLoadingComponent } from '~/classrooms/components/ui/classroom-admin-panel-loading.component'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { educationalExperienceFormats } from '~/shared/data/educationalExperienceFormats'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { ErrorMessages } from '~/shared/types/ErrorMessages'

const createAbilityErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

const editAbilityErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

const deleteAbilityErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

const abilitiesLoadingErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

@Component({
  selector: 'gow-classroom-admin-panel-abilities',
  templateUrl: './classroom-admin-panel-abilities.component.html',
  imports: [
    AbilityFormDialogComponent,
    ClassroomAdminPanelLoadingComponent,
    ConfirmDialogModule,
    RouterLink,
    Toast,
    TableModule,
    ButtonModule,
    LucideAngularModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class ClassroomAdminPanelAbiltiesPageComponent implements OnInit {
  public readonly addIcon = Plus
  public readonly deleteIcon = Trash2
  public readonly editIcon = Pencil

  private readonly abilityService = inject(AbilityService)

  public readonly classroomContext = inject(ClassroomAdminPanelContextService)
  private readonly toastService = inject(MessageService)
  private readonly confirmationService = inject(ConfirmationService)

  public abilities = signal<AbilityModel[]>([])
  public isAbilitiesLoading = signal<boolean>(true)

  public editAbilitySelected = signal<{
    id: string | null
    form: FormGroup<AbilityForm> | null
  }>({ id: null, form: null })

  public showCreateAbilityFormDialog = signal<boolean>(false)
  public showEditAbilityFormDialog = signal<boolean>(false)

  public isAbilityDeletingLoading = signal<boolean>(false)

  public hasActiveAcademicPeriod = computed(
    () => this.classroomContext.activeAcademicPeriod() !== null
  )

  ngOnInit(): void {
    this.loadAbilities()
  }

  public getAbilityTypeFormat(type: AbilityType) {
    return abilityTypeFormats[type]
  }

  public getEducationalExperienceFormat(type: EducationalExperience) {
    return educationalExperienceFormats[type]
  }

  public getAbilityUsageTypeFormat(type: AbilityUsage) {
    return abilityUsageFormats[type]
  }

  public getAbilityActionTypeFormat(type: AbilityActionType) {
    return abilityActionTypeFormats[type]
  }

  public onCloseFormDialog() {
    this.showCreateAbilityFormDialog.set(false)
    this.showEditAbilityFormDialog.set(false)
    this.editAbilitySelected.set({ id: null, form: null })
  }

  public onOpenCreateAbilityForm() {
    this.showCreateAbilityFormDialog.set(true)
    this.editAbilitySelected.set({
      id: null,
      form: null
    })
  }

  public onOpenEditAbilityForm(event: Event, ability: AbilityModel) {
    event.stopPropagation()
    this.showEditAbilityFormDialog.set(true)
    this.editAbilitySelected.set({
      id: ability.id,
      form: fullAbilityForm(AbilityFormMapper.toForm(ability))
    })
  }

  public onCreateAbility(submit: AbilityFormSubmit) {
    const classroomId = this.classroomContext.classroom()?.id ?? null

    if (classroomId === null) return

    const abilityFormData = AbilityFormMapper.toModel(submit.result.formData)

    this.abilityService
      .createAbility({
        classroomId,
        ...abilityFormData
      })
      .then(newAbility => {
        this.abilities.update(abilities => [newAbility, ...abilities])
        submit.onFinish()
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showCreateAbilityErrorMessage(error.code)
        submit.onError()
      })
  }

  public onEditAbility(submit: AbilityFormSubmit) {
    const classroomId = this.classroomContext.classroom()?.id ?? null
    const abilityId = submit.result.id

    if (classroomId === null || abilityId === null) return

    const abilityFormData = AbilityFormMapper.toModel(submit.result.formData)

    this.abilityService
      .updateAbilityById(abilityId, abilityFormData)
      .then(() => {
        this.abilities.update(abilities => {
          const updateAbilityIndex = abilities.findIndex(
            ability => ability.id === abilityId
          )
          if (updateAbilityIndex === -1) return abilities

          abilities[updateAbilityIndex] = {
            id: abilityId,
            ...abilityFormData
          }
          return abilities
        })
        submit.onFinish()
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showEditAbilityErrorMessage(error.code)
        submit.onError()
      })
  }

  public onDeleteAbility(event: Event, abilityId: string) {
    event.stopPropagation()

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estas seguro de eliminar la habilidad?',
      header: 'Eliminar habilidad',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
        loading: this.isAbilityDeletingLoading()
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
        loading: this.isAbilityDeletingLoading()
      },
      accept: async () => {
        this.isAbilityDeletingLoading.set(true)

        try {
          await this.abilityService.deleteAbilityById(abilityId)
          this.abilities.update(abilities =>
            abilities.filter(ability => ability.id !== abilityId)
          )
        } catch (err) {
          const error = err as ErrorResponse
          this.showDeleteAbilityErrorMessage(error.code)
        } finally {
          this.isAbilityDeletingLoading.set(false)
        }
      }
    })
  }

  private loadAbilities() {
    const classroomId = this.classroomContext.classroom()?.id ?? null

    if (classroomId === null) return

    this.isAbilitiesLoading.set(true)

    this.abilityService
      .getAllAbilitiesByClassroomAsync(classroomId)
      .then(abilities => {
        this.abilities.set(abilities)
        this.isAbilitiesLoading.set(false)
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showAbilitiesLoadingErrorMessage(error.code)
      })
  }

  private showCreateAbilityErrorMessage(code: string) {
    const { summary, message } = createAbilityErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showEditAbilityErrorMessage(code: string) {
    const { summary, message } = editAbilityErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showDeleteAbilityErrorMessage(code: string) {
    const { summary, message } = deleteAbilityErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showAbilitiesLoadingErrorMessage(code: string) {
    const { summary, message } = abilitiesLoadingErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showErrorMessage(summary: string, detail: string) {
    this.toastService.add({ severity: 'error', summary, detail })
  }
}
