import {
  Component,
  HostListener,
  inject,
  input,
  output,
  signal
} from '@angular/core'
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { LucideAngularModule, X } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { Toast } from 'primeng/toast'
import { NumberFieldComponent } from '~/shared/components/ui/number-field/number-field.component'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import { FieldValidator } from '~/shared/validators/FieldValidator'
import { StudentPeriodStateService } from '~/students/services/student-period-state/student-period-state.service'

const eliminateStudentByVotesErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

@Component({
  selector: 'gow-eliminate-student-by-votes-form-dialog',
  templateUrl: './eliminate-student-by-votes-form-dialog.component.html',
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    NumberFieldComponent,
    Toast
  ],
  providers: [MessageService]
})
export class EliminateStudentByVotesFormDialogComponent {
  public readonly closeIcon = X

  private readonly studentPeriodStateService = inject(StudentPeriodStateService)
  private readonly toastService = inject(MessageService)

  public showDialog = input.required<boolean>({ alias: 'show' })
  public studentPeriodStateId = input<string | null>(null, {
    alias: 'studentPeriodStateId'
  })
  public studentFullName = input<string | null>(null, {
    alias: 'studentFullName'
  })

  public isLoading = signal<boolean>(false)

  public onClose = output<void>({ alias: 'close' })
  public onSuccess = output<string>({
    alias: 'success'
  })

  public votesControl = new FormControl<number>(0, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1), FieldValidator.isNaN()]
  })

  public onEliminateStudentByVotes() {
    const studentPeriodStateId = this.studentPeriodStateId()

    if (this.votesControl.invalid || studentPeriodStateId === null) return

    const votes = this.votesControl.getRawValue()

    this.isLoading.set(true)

    this.studentPeriodStateService
      .eliminateStudentByVotes(studentPeriodStateId, votes)
      .then(() => {
        this.onSuccess.emit(studentPeriodStateId)
        this.onCloseDialog()
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showEliminateStudentByVotesErrorMessage(error.code)
        this.isLoading.set(false)
      })
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.onCloseDialog()
  }

  public onCloseDialog() {
    this.onClose.emit()
    this.votesControl.reset(0)
    this.isLoading.set(false)
  }

  public hasErrorValidation(
    control: AbstractControl | null,
    validationKey: string
  ) {
    return control?.pristine || control?.hasError(validationKey)
  }

  private showEliminateStudentByVotesErrorMessage(code: string) {
    const { summary, message } = eliminateStudentByVotesErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showErrorMessage(summary: string, detail: string) {
    this.toastService.add({ severity: 'error', summary, detail })
  }
}
