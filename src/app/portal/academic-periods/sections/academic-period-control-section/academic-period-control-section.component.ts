import { Component, computed, inject, OnInit, signal } from '@angular/core'
import type { ErrorResponse } from '@shared/types/ErrorResponse'
import { LucideAngularModule, Play, Square } from 'lucide-angular'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { Toast } from 'primeng/toast'
import { StartAcademicPeriodDialogComponent } from '~/academic-periods/components/start-academic-period-dialog/start-academic-period-dialog.component'
import type { AcademicPeriodModel } from '~/academic-periods/models/AcademicPeriod.model'
import { AcademicPeriodService } from '~/academic-periods/services/academic-period/academic-period.service'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { GeneralPanelContextService } from '~/shared/contexts/general-panel-context/general-panel-context.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { DefaultSchoolStore } from '~/shared/store/default-school.store'
import type { ErrorMessages } from '~/shared/types/ErrorMessages'
import { getWeekAndDayDifference } from '~/shared/utils/getWeekAndDayDifference'

const stopAcademicPeriodErrorMessages: ErrorMessages = {
  'academic-period-not-exist': {
    summary: 'Periodo académico',
    message: 'El periodo académico a detener no existe'
  },
  ...commonErrorMessages
}

@Component({
  selector: 'gow-academic-period-control-section',
  templateUrl: './academic-period-control-section.component.html',
  imports: [
    Toast,
    ProgressSpinnerModule,
    LucideAngularModule,
    ConfirmDialogModule,
    StartAcademicPeriodDialogComponent
  ],
  providers: [ConfirmationService, MessageService]
})
export class AcademicPeriodControlSectionComponent implements OnInit {
  private readonly academicPeriodService = inject(AcademicPeriodService)
  private readonly confirmationService = inject(ConfirmationService)
  private readonly toastService = inject(MessageService)

  private readonly defaultSchoolStore = inject(DefaultSchoolStore)
  private readonly context = inject(GeneralPanelContextService)
  private readonly classroomContext = inject(ClassroomAdminPanelContextService)

  readonly startAcademicPeriod = Play
  readonly stopAcademicPeriod = Square

  public activeAcademicPeriodLoading = signal<boolean>(true)
  public stopAcademicPeriodLoading = signal<boolean>(false)
  public activeAcademicPeriod = signal<AcademicPeriodModel | null>(null)
  public weekAndDayDiff = signal<{ week: number; day: number } | null>(null)
  public showStartAcademicPeriodDialog = signal<boolean>(false)

  public school = computed(() => this.defaultSchoolStore.school())

  public academicPeriodFullName = computed<string>(() => {
    const weekAndDayDiff = this.weekAndDayDiff()

    if (weekAndDayDiff === null) return ''

    return `${this.activeAcademicPeriod()?.name}· Semana ${weekAndDayDiff.week}· Día ${weekAndDayDiff.day}`
  })

  ngOnInit(): void {
    this.onLoadAcademicPeriod()
  }

  public onShowStartAcademicPeriodDialog() {
    this.showStartAcademicPeriodDialog.set(true)
  }

  public onCloseStartAcademicPeriodDialog() {
    this.showStartAcademicPeriodDialog.set(false)
  }

  public onSuccessStartAcademicPeriod(newAcademicPeriod: AcademicPeriodModel) {
    this.activeAcademicPeriod.set(newAcademicPeriod)
    this.weekAndDayDiff.set(
      getWeekAndDayDifference(newAcademicPeriod.startedAt)
    )
    this.context.activeAcademicPeriod.set(newAcademicPeriod)
  }

  public onShowStopAcademicPeriodConfimation(event: Event) {
    if (this.activeAcademicPeriod() === null) return

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Estas seguro de finalizar el periodo académico "${this.activeAcademicPeriod()!.name}"?`,
      header: 'Finalización de periodo académico',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Finalizar',
        severity: 'danger',
        loading: this.stopAcademicPeriodLoading()
      },
      accept: async () => {
        const schoolId = this.school()?.id ?? null

        if (schoolId === null) return

        await this.onStopAcademicPeriod(schoolId)
      }
    })
  }

  private onLoadAcademicPeriod() {
    const schoolId = this.defaultSchoolStore.school()?.id ?? null

    if (schoolId === null) return

    this.academicPeriodService
      .getSchoolActiveAcademicPeriod(schoolId)
      .subscribe({
        next: activeAcademicPeriod => {
          this.activeAcademicPeriod.set(activeAcademicPeriod)
          this.weekAndDayDiff.set(
            getWeekAndDayDifference(activeAcademicPeriod.startedAt)
          )
          this.activeAcademicPeriodLoading.set(false)
          this.context.activeAcademicPeriod.set(
            activeAcademicPeriod.endedAt !== null ? null : activeAcademicPeriod
          )
        },
        error: err => {
          const error = err as ErrorResponse
          if (error.code === 'active-academic-period-not-exist') {
            this.activeAcademicPeriodLoading.set(false)
            return
          }
          this.onShowErrorMessage(error.code)
        }
      })
  }

  private async onStopAcademicPeriod(schoolId: string) {
    this.stopAcademicPeriodLoading.set(true)

    this.academicPeriodService
      .endOfAcademicPeriod(schoolId)
      .then(() => {
        this.activeAcademicPeriod.set(null)
        this.context.activeAcademicPeriod.set(null)
        this.classroomContext.experienceSession.set(null)
        this.classroomContext.classSession.set(null)
        this.classroomContext.activeAcademicPeriod.set(null)
        this.classroomContext.classroom.set(null)
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.onShowErrorMessage(error.message)
      })
      .finally(() => {
        this.stopAcademicPeriodLoading.set(false)
      })
  }

  private onShowErrorMessage(code: string) {
    const { summary, message } = stopAcademicPeriodErrorMessages[code]
    this.toastService.add({ summary, detail: message, severity: 'error' })
  }
}
