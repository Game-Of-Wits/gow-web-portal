import { Component, inject, input, output, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { Dialog } from 'primeng/dialog'
import { Toast } from 'primeng/toast'
import type { AcademicPeriodModel } from '~/academic-periods/models/AcademicPeriod.model'
import { AcademicPeriodService } from '~/academic-periods/services/academic-period/academic-period.service'
import { TextFieldComponent } from '~/shared/components/ui/text-field/text-field.component'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import type { ErrorMessages } from '~/shared/types/ErrorMessages'

const startAcademicPeriodErrorMessages: ErrorMessages = {
  'academic-period-exist': {
    summary: 'Periodo académico existente',
    message: 'Se ha encontrado un periodo académico ya activo'
  },
  ...commonErrorMessages
}

@Component({
  selector: 'gow-start-academic-period-dialog',
  templateUrl: './start-academic-period-dialog.component.html',
  imports: [
    Toast,
    Dialog,
    ButtonModule,
    ReactiveFormsModule,
    TextFieldComponent
  ],
  providers: [MessageService]
})
export class StartAcademicPeriodDialogComponent {
  private readonly toastService = inject(MessageService)
  private readonly academicPeriodService = inject(AcademicPeriodService)

  public schoolId = input.required<string | undefined>({ alias: 'schoolId' })
  public showDialog = input<boolean>(false, { alias: 'show' })

  public onClose = output<void>({ alias: 'close' })
  public onSuccess = output<AcademicPeriodModel>({ alias: 'success' })

  public readonly isLoading = signal<boolean>(false)

  public newAcademicPeriodName = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)]
  })

  public async createAcademicPeriod() {
    const schoolId = this.schoolId()

    if (this.newAcademicPeriodName.invalid || !schoolId) return

    this.isLoading.set(true)

    try {
      const newAcademicPeriod =
        await this.academicPeriodService.startNewAcademicPeriod({
          name: this.newAcademicPeriodName.value.trim(),
          schoolId
        })

      this.onSuccess.emit(newAcademicPeriod)
      this.onClose.emit()
    } catch (err) {
      const error = err as Error
      const { code: errorCode } = JSON.parse(error.message) as { code: string }

      if (errorCode in startAcademicPeriodErrorMessages) {
        this.onShowErrorMessage(
          startAcademicPeriodErrorMessages[errorCode].summary,
          startAcademicPeriodErrorMessages[errorCode].message
        )

        return
      }

      this.onShowErrorMessage(
        'Error inesperado',
        'Ha ocurrido un fallo al iniciar sesión, vuelva a intentarlo de nuevo'
      )
    } finally {
      this.isLoading.set(false)
    }
  }

  public onCloseDialog() {
    this.onClose.emit()
  }

  public onCheckInvalidName(validationKey: string) {
    return this.newAcademicPeriodName.hasError(validationKey)
  }

  private onShowErrorMessage(summary: string, message: string) {
    this.toastService.add({ summary, detail: message, severity: 'error' })
  }
}
