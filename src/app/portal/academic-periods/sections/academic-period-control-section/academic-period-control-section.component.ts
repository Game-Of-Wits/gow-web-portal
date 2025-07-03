import { Component, inject, OnInit, signal } from '@angular/core'
import type { ErrorResponse } from '@shared/types/ErrorResponse'
import { LucideAngularModule, Play, Square } from 'lucide-angular'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { Toast } from 'primeng/toast'
import { StartAcademicPeriodDialogComponent } from '~/academic-periods/components/start-academic-period-dialog/start-academic-period-dialog.component'
import type { AcademicPeriodModel } from '~/academic-periods/models/AcademicPeriod.model'
import { AcademicPeriodService } from '~/academic-periods/services/academic-period/academic-period.service'
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

  readonly defaultSchoolStore = inject(DefaultSchoolStore)

  readonly startAcademicPeriod = Play
  readonly stopAcademicPeriod = Square

  public activeAcademicPeriodLoading = signal<boolean>(true)
  public stopAcademicPeriodLoading = signal<boolean>(false)
  public activeAcademicPeriod = signal<AcademicPeriodModel | null>(null)
  public weekAndDayDiff = signal<{ week: number; day: number } | null>(null)
  public showStartAcademicPeriodDialog = signal<boolean>(false)

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
        const activeAcademicPeriod = this.activeAcademicPeriod()

        if (!activeAcademicPeriod) return

        this.stopAcademicPeriodLoading.set(true)
        await this.onStopAcademicPeriod(activeAcademicPeriod.id)
        this.stopAcademicPeriodLoading.set(false)
      }
    })
  }

  private onLoadAcademicPeriod() {
    this.academicPeriodService
      .getSchoolActiveAcademicPeriod(this.defaultSchoolStore.school()!.id)
      .subscribe({
        next: activeAcademicPeriod => {
          if (!activeAcademicPeriod) return

          this.activeAcademicPeriod.set(activeAcademicPeriod)
          this.weekAndDayDiff.set(
            getWeekAndDayDifference(activeAcademicPeriod.startedAt!)
          )
        },
        complete: () => {
          this.activeAcademicPeriodLoading.set(false)
        },
        error: err => {
          const error = err as ErrorResponse
          this.onShowErrorMessage(error.code)
        }
      })
  }

  private async onStopAcademicPeriod(academicPeriodId: string) {
    try {
      await this.academicPeriodService.endOfAcademicPeriod(academicPeriodId)
      this.activeAcademicPeriod.set(null)
    } catch (err) {
      const error = err as Error
      const { code: errorCode } = JSON.parse(error.message) as { code: string }
      this.onShowErrorMessage(errorCode)
    }
  }

  private onShowErrorMessage(code: string) {
    const { summary, message } = stopAcademicPeriodErrorMessages[code]
    this.toastService.add({ summary, detail: message, severity: 'error' })
  }
}
