import { Component, computed, inject, OnInit, signal } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import {
  Calendar,
  Dices,
  LucideAngularModule,
  Pencil,
  Square,
  SquareCheckBig,
  Timer,
  TimerReset,
  Trash2
} from 'lucide-angular'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { TagModule } from 'primeng/tag'
import { Toast } from 'primeng/toast'
import {
  AbilityFormDialogComponent,
  AbilityFormSubmit
} from '~/abilities/components/ability-form-dialog/ability-form-dialog.component'
import {
  abilityClassShiftFormats,
  abilityTypeFormats,
  abilityUsageFormats,
  abilityUsageIntervalFormats
} from '~/abilities/data/formats'
import { fullAbilityForm } from '~/abilities/forms/fullAbilityForm'
import { AbilityFormMapper } from '~/abilities/mappers/ability-form.mapper'
import { AbilityModel } from '~/abilities/models/Ability.model'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AbilityForm } from '~/abilities/models/AbilityForm.model'
import { AbilityService } from '~/abilities/services/ability/ability.service'
import { ClassroomAdminPanelLoadingComponent } from '~/classrooms/components/ui/classroom-admin-panel-loading.component'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { PageHeaderComponent } from '~/shared/components/ui/page-header/page-header.component'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { educationalExperienceFormats } from '~/shared/data/educationalExperienceFormats'
import { DefaultSchoolStore } from '~/shared/store/default-school.store'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import { AscensionActionCardComponent } from './components/ascension-action-card.component'
import { DeferealHomeworkActionCardComponent } from './components/defereal-homework-action-card.component'
import { HealthActionCardComponent } from './components/health-action-card.component'
import { ProtectionActionCardComponent } from './components/protection-action-card.component'
import { RevealActionCardComponent } from './components/reveal-action-card.component'
import { ReviveActionCardComponent } from './components/revive-action-card.component'
import { TheftActionCardComponent } from './components/theft-action-card.component'
import { MirrorActionCardComponent } from './components/mirror-action-card.component'
import { RevengeActionCardComponent } from './components/revenge-action-card.component'
import { InvulnerabilityActionCardComponent } from './components/invulnerability-action-card.component'

const deleteAbilityErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

const editAbilityErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

const abilityLoadingErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

@Component({
  selector: 'gow-classroom-admin-panel-ability-details',
  templateUrl: 'classroom-admin-panel-ability-details.component.html',
  imports: [
    Toast,
    CardModule,
    PageHeaderComponent,
    ClassroomAdminPanelLoadingComponent,
    AbilityFormDialogComponent,
    DeferealHomeworkActionCardComponent,
    TheftActionCardComponent,
    HealthActionCardComponent,
    RevealActionCardComponent,
    ReviveActionCardComponent,
    ProtectionActionCardComponent,
    MirrorActionCardComponent,
    RevengeActionCardComponent,
    InvulnerabilityActionCardComponent,
    AscensionActionCardComponent,
    ButtonModule,
    TagModule,
    ConfirmDialogModule,
    CardModule,
    LucideAngularModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class ClassroomAdminPanelAbilityDetailsPageComponent implements OnInit {
  public readonly abilityTypeIcon = Dices
  public readonly abilityUsageTypeIcon = Timer
  public readonly abilityClassShiftIcon = Calendar
  public readonly abilityUsageIntervalIcon = TimerReset
  public readonly educationalExperienceIcon = Dices
  public readonly editIcon = Pencil
  public readonly deleteIcon = Trash2
  public readonly isInitialAbilityIcon = SquareCheckBig
  public readonly isNotInitialAbilityIcon = Square

  public readonly educationalExperienceFormats = educationalExperienceFormats
  public readonly abilityTypeFormats = abilityTypeFormats
  public readonly abilityUsageTypeFormats = abilityUsageFormats
  public readonly abilityUsageShiftFormats = abilityClassShiftFormats
  public readonly abilityUsageIntervalFormats = abilityUsageIntervalFormats

  public readonly abilityActionType = AbilityActionType

  private readonly abilityService = inject(AbilityService)

  private readonly toastService = inject(MessageService)
  private readonly confirmationService = inject(ConfirmationService)
  private readonly router = inject(Router)
  public readonly activatedRoute = inject(ActivatedRoute)
  public readonly defaultSchoolStore = inject(DefaultSchoolStore)
  public readonly classroomContext = inject(ClassroomAdminPanelContextService)

  public ability = signal<AbilityModel | null>(null)
  public isAbilityLoading = signal<boolean>(false)

  public editAbilitySelected = signal<{
    id: string | null
    form: FormGroup<AbilityForm> | null
  }>({ id: null, form: null })

  public showEditAbilityFormDialog = signal<boolean>(false)

  public isAbilityDeletingLoading = signal<boolean>(false)

  public hasActiveAcademicPeriod = computed(
    () => this.classroomContext.activeAcademicPeriod() !== null
  )

  ngOnInit(): void {
    const abilityId = this.activatedRoute.snapshot.paramMap.get('abilityId')

    if (abilityId === null) return

    this.loadAbilityDetails(abilityId)
  }

  public defaultBackPath = {
    commands: ['../'],
    extras: { relativeTo: this.activatedRoute }
  }

  public onCloseFormDialog() {
    this.showEditAbilityFormDialog.set(false)
    this.editAbilitySelected.set({
      id: null,
      form: null
    })
  }

  public onOpenEditAbilityFormDialog(ability: AbilityModel) {
    this.showEditAbilityFormDialog.set(true)
    this.editAbilitySelected.set({
      id: ability.id,
      form: fullAbilityForm(AbilityFormMapper.toForm(ability))
    })
  }

  public onEditAbility(submit: AbilityFormSubmit) {
    const classroomId = this.classroomContext.classroom()?.id ?? null
    const abilityId = submit.result.id

    if (classroomId === null || abilityId === null) return

    const data = AbilityFormMapper.toModel(submit.result.formData)

    this.abilityService
      .updateAbilityById(abilityId, data)
      .then(() => {
        this.ability.set({
          ...data,
          id: abilityId
        })

        submit.onFinish()

        this.toastService.add({
          severity: 'success',
          summary: 'Habilidad editada exitosamente',
          detail:
            'La información de la habilidad ha sido editada sin ningún problema'
        })
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showEditAbilityErrorMessage(error.code)
        submit.onError()
      })
  }

  public onDeleteAbility(event: Event, abilityId: string) {
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
          this.router.navigate(['../'], { relativeTo: this.activatedRoute })
        } catch (err) {
          const error = err as ErrorResponse
          this.showDeleteAbilityErrorMessage(error.code)
        } finally {
          this.isAbilityDeletingLoading.set(false)
        }
      }
    })
  }

  private loadAbilityDetails(abilityId: string) {
    this.isAbilityLoading.set(true)

    this.abilityService
      .getAbilityByIdAsync(abilityId)
      .then(ability => {
        this.ability.set(ability)
        this.isAbilityLoading.set(false)
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showAbilityLoadingErrorMessage(error.code)
      })
  }

  private showDeleteAbilityErrorMessage(code: string) {
    const { summary, message } = deleteAbilityErrorMessages[code]
    this.toastService.add({ severity: 'error', summary, detail: message })
  }

  private showEditAbilityErrorMessage(code: string) {
    const { summary, message } = editAbilityErrorMessages[code]
    this.toastService.add({ severity: 'error', summary, detail: message })
  }

  private showAbilityLoadingErrorMessage(code: string) {
    const { summary, message } = abilityLoadingErrorMessages[code]
    this.toastService.add({ severity: 'error', summary, detail: message })
  }
}
