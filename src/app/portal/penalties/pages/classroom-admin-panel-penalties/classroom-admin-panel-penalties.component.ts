import { Component, computed, inject, signal } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { LucideAngularModule, Pencil, Plus, Trash2 } from 'lucide-angular'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { TableModule } from 'primeng/table'
import { Toast } from 'primeng/toast'
import { ClassroomAdminPanelLoadingComponent } from '~/classrooms/components/ui/classroom-admin-panel-loading.component'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import {
  PenaltyFormDialogComponent,
  PenaltyFormSubmit
} from '~/penalties/components/penalty-form-dialog/penalty-form-dialog.component'
import { penaltyForm } from '~/penalties/forms/penaltyForm'
import { PenaltyModel } from '~/penalties/models/Penalty.model'
import { PenaltyForm } from '~/penalties/models/PenaltyForm.model'
import { PenaltyService } from '~/penalties/services/penalty/penalty.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { ErrorMessages } from '~/shared/types/ErrorMessages'

const deletePenaltyErrorMessage: ErrorMessages = {
  ...commonErrorMessages
}

const createPenaltyErrorMessage: ErrorMessages = {
  ...commonErrorMessages
}

const penaltiesErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

@Component({
  selector: 'gow-classroom-admin-panel-penalties',
  templateUrl: './classroom-admin-panel-penalties.component.html',
  imports: [
    ClassroomAdminPanelLoadingComponent,
    PenaltyFormDialogComponent,
    Toast,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    LucideAngularModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class ClassroomAdminPanelPenaltiesPageComponent {
  public readonly addIcon = Plus
  public readonly deleteIcon = Trash2
  public readonly editIcon = Pencil

  private readonly penaltyService = inject(PenaltyService)

  private readonly toastService = inject(MessageService)
  private readonly classroomContext = inject(ClassroomAdminPanelContextService)
  private readonly confirmationService = inject(ConfirmationService)

  public penalties = signal<PenaltyModel[]>([])
  public isPenaltiesLoading = signal<boolean>(true)

  public showCreatePenalty = signal<boolean>(false)
  public showEditPenalty = signal<boolean>(false)

  public deletingPenaltyLoading = signal<boolean>(false)

  public penaltyFormSelected = signal<{
    id: string
    form: FormGroup<PenaltyForm> | null
  }>({
    id: '',
    form: null
  })

  public hasActiveAcademicPeriod = computed(
    () => this.classroomContext.activeAcademicPeriod() !== null
  )

  ngOnInit(): void {
    this.loadPenalties()
  }

  public onCloseDialog() {
    this.showCreatePenalty.set(false)
    this.showEditPenalty.set(false)
    this.penaltyFormSelected.set({
      id: '',
      form: null
    })
  }

  public onOpenCreatePenaltyDialog() {
    this.showCreatePenalty.set(true)
    this.penaltyFormSelected.set({
      id: '',
      form: penaltyForm()
    })
  }

  public onOpenEditPenaltyDialog(penalty: PenaltyModel) {
    this.showEditPenalty.set(true)
    this.penaltyFormSelected.set({
      id: penalty.id,
      form: penaltyForm({
        reducePoints: penalty.reducePoints,
        name: penalty.name
      })
    })
  }

  public onCreatePenalty(submit: PenaltyFormSubmit) {
    const classroomId = this.classroomContext.classroom()?.id ?? null

    if (classroomId === null) return

    const formData = submit.result.form.getRawValue()

    this.penaltyService
      .createPenalty({ ...formData, classroomId: classroomId })
      .then(() => {
        this.loadPenalties()
        submit.onFinish()
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.onShowCreatePenaltyErrorMessage(error.code)
      })
  }

  public onEditPenalty(submit: PenaltyFormSubmit) {
    const classroomId = this.classroomContext.classroom()?.id ?? null
    const penaltyId = submit.result.id as string

    if (classroomId === null || penaltyId === '') return

    const formData = submit.result.form.getRawValue()

    this.penaltyService
      .updatePenaltyById(penaltyId, { ...formData })
      .then(() => {
        this.penalties.update(penalties => {
          const penaltyIndex = penalties.findIndex(
            penalty => penalty.id === submit.result.id
          )

          if (penaltyIndex < 0) return penalties

          const penalty = penalties[penaltyIndex]
          penalties[penaltyIndex] = {
            id: penalty.id,
            classroomId: penalty.classroomId,
            reducePoints: formData.reducePoints,
            name: formData.name
          }
          return penalties
        })
        submit.onFinish()
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.onShowCreatePenaltyErrorMessage(error.code)
      })
  }

  public onShowDeletePenaltyConfirmation(penaltyId: string, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estas seguro de eliminar la penalización?',
      header: 'Eliminar penalización',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
        loading: this.deletingPenaltyLoading()
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
        loading: this.deletingPenaltyLoading()
      },
      accept: async () => {
        this.deletingPenaltyLoading.set(true)

        try {
          await this.penaltyService.deletePenaltyById(penaltyId)
          this.penalties.update(penalties =>
            penalties.filter(penalty => penalty.id !== penaltyId)
          )
        } catch (err) {
          const error = err as ErrorResponse
          this.onShowDeletePenaltyErrorMessage(error.code)
        } finally {
          this.deletingPenaltyLoading.set(false)
        }
      }
    })
  }

  private loadPenalties() {
    const classroomId = this.classroomContext.classroom()?.id ?? null

    if (classroomId === null) return

    this.isPenaltiesLoading.set(true)

    this.penaltyService.getAllPenaltiesByClassroom(classroomId).subscribe({
      next: penalties => {
        this.penalties.set(penalties)
        this.isPenaltiesLoading.set(false)
      },
      error: err => {
        const error = err as ErrorResponse
        this.onShowPenaltiesLoadingErrorMessage(error.code)
      }
    })
  }

  private onShowDeletePenaltyErrorMessage(code: string) {
    const { summary, message } = deletePenaltyErrorMessage[code]
    this.onShowErrorResponse(summary, message)
  }

  private onShowCreatePenaltyErrorMessage(code: string) {
    const { summary, message } = createPenaltyErrorMessage[code]
    this.onShowErrorResponse(summary, message)
  }

  private onShowPenaltiesLoadingErrorMessage(code: string) {
    const { summary, message } = penaltiesErrorMessages[code]
    this.onShowErrorResponse(summary, message)
  }

  private onShowErrorResponse(summary: string, detail: string) {
    this.toastService.add({ severity: 'error', detail, summary })
  }
}
