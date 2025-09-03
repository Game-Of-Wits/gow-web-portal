import {
  Component,
  HostListener,
  inject,
  input,
  output,
  signal
} from '@angular/core'
import { AbstractControl, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { AlertTriangle, LucideAngularModule, X } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { DatePickerModule } from 'primeng/datepicker'
import { DialogModule } from 'primeng/dialog'
import { MessageModule } from 'primeng/message'
import { Toast } from 'primeng/toast'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { deliveryHomeworkGroupForm } from '~/homeworks/forms/deliveryHomeworkGroupForm'
import { HomeworkGroupService } from '~/homeworks/services/homework-group/homework-group.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { ErrorMessages } from '~/shared/types/ErrorMessages'

const sendHomeworksToStudentsErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

@Component({
  selector: 'gow-delivery-homework-group-form-dialog',
  templateUrl: './delivery-homework-group-form-dialog.component.html',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    DatePickerModule,
    LucideAngularModule,
    MessageModule,
    Toast
  ],
  providers: [MessageService]
})
export class DeliveryHomeworkGroupFormDialog {
  public readonly closeIcon = X
  public readonly alertIcon = AlertTriangle

  private readonly homeworkGroupService = inject(HomeworkGroupService)

  private readonly classroomContext = inject(ClassroomAdminPanelContextService)
  private readonly toastService = inject(MessageService)
  private readonly router = inject(Router)

  public deliveryHomeworkGroupForm = deliveryHomeworkGroupForm()

  public showDialog = input.required<boolean>({ alias: 'show' })
  public homeworkGroupId = input.required<string>({ alias: 'homeworkGroupId' })

  public deliveringLoading = signal<boolean>(false)

  public onClose = output<void>({ alias: 'close' })
  public onSubmit = output<void>({
    alias: 'submit'
  })

  public today = signal<Date>(new Date())

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.onCloseDialog()
  }

  public hasErrorValidation(
    control: AbstractControl | null,
    validationKey: string
  ) {
    return control?.pristine || control?.hasError(validationKey)
  }

  public onDeliveryHomeworkGroup() {
    const classroom = this.classroomContext.classroom()

    if (this.deliveryHomeworkGroupForm.invalid || classroom === null) return

    const deliveryHomeworkGroupData =
      this.deliveryHomeworkGroupForm.getRawValue()

    this.deliveringLoading.set(true)

    this.homeworkGroupService
      .sendHomeworksToStudents(classroom.schoolId, {
        baseDateLimit: deliveryHomeworkGroupData.baseDateLimit,
        homeworkGroupId: this.homeworkGroupId()
      })
      .then(() => {
        this.router.navigate([
          'p',
          's',
          classroom.schoolId,
          'c',
          classroom.id,
          'homeworks',
          'g',
          this.homeworkGroupId()
        ])
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showSendHomeworksToStudentsErrorMessage(error.code)
      })
  }

  public onCloseDialog() {
    this.deliveryHomeworkGroupForm = deliveryHomeworkGroupForm()
    this.onClose.emit()
    this.deliveringLoading.set(false)
  }

  get baseDateLimitControl(): AbstractControl<Date> {
    return this.deliveryHomeworkGroupForm.get(
      'baseDateLimit'
    ) as AbstractControl<Date>
  }

  private showSendHomeworksToStudentsErrorMessage(code: string) {
    const { summary, message } = sendHomeworksToStudentsErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showErrorMessage(summary: string, detail: string) {
    this.toastService.add({ severity: 'error', summary, detail })
  }
}
