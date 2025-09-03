import {
  Component,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  signal
} from '@angular/core'
import { AbstractControl, ReactiveFormsModule } from '@angular/forms'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { AlertTriangle, LucideAngularModule, X } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { MessageModule } from 'primeng/message'
import { TagModule } from 'primeng/tag'
import { Toast } from 'primeng/toast'
import { modifyStudentProgressPointsForm } from '~/classrooms/forms/modifyStudentProgressPointsForm'
import { NumberFieldComponent } from '~/shared/components/ui/number-field/number-field.component'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { pointsModifierOptions } from '~/shared/data/pointsModifierOptions'
import { PointsModifier } from '~/shared/models/PointsModifier'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import { StudentPeriodStateService } from '~/students/services/student-period-state/student-period-state.service'

const modifyStudentProgressPointsErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

export interface ModifyStudentProgressPointsSuccess {
  studentPeriodStateId: string
  newStudentProgressPoints: number
}

@Component({
  selector: 'gow-modify-student-progress-points-form-dialog',
  templateUrl: './modify-student-progress-points-form-dialog.component.html',
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    SelectFieldComponent,
    NumberFieldComponent,
    TagModule,
    MessageModule,
    Toast
  ],
  providers: [MessageService]
})
export class ModifyStudentProgressPointsFormDialogComponent implements OnInit {
  public readonly closeIcon = X
  public readonly dangerIcon = AlertTriangle

  public readonly pointsModifierOptions = pointsModifierOptions
  public readonly pointsModifier = PointsModifier

  private readonly studentPeriodStateService = inject(StudentPeriodStateService)

  private readonly toastService = inject(MessageService)

  public showDialog = input.required<boolean>({ alias: 'show' })
  public studentPeriodStateId = input<string | null>(null, {
    alias: 'studentPeriodStateId'
  })
  public studentFullName = input<string | null>(null, {
    alias: 'studentFullName'
  })
  public currentStudentProgressPoints = input<number>(0, {
    alias: 'currentStudentProgressPoints'
  })

  public isLoading = signal<boolean>(false)
  public finalProgressPoints = signal<number>(
    this.currentStudentProgressPoints()
  )

  public onClose = output<void>({ alias: 'close' })
  public onSuccess = output<ModifyStudentProgressPointsSuccess>({
    alias: 'success'
  })

  public modifyStudentProgressPointsForm = modifyStudentProgressPointsForm()

  ngOnInit(): void {
    this.modifyStudentProgressPointsForm.valueChanges.subscribe(() => {
      this.calcFinalProgressPoints()
    })
  }

  public onModifyStudentProgressPoints() {
    const studentPeriodStateId = this.studentPeriodStateId()

    if (
      this.modifyStudentProgressPointsForm.invalid ||
      studentPeriodStateId === null
    )
      return

    const formData = this.modifyStudentProgressPointsForm.getRawValue()

    this.isLoading.set(true)

    this.studentPeriodStateService
      .modifyStudentProgressPoints(studentPeriodStateId, {
        modifier: formData.modifier,
        points: formData.points
      })
      .then(newStudentProgressPoints => {
        this.onSuccess.emit({
          studentPeriodStateId,
          newStudentProgressPoints
        })
        this.onCloseDialog()
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showModifyStudentProgressPointsErrorMessage(error.code)
        this.isLoading.set(false)
      })
  }

  public onCloseDialog() {
    this.modifyStudentProgressPointsForm.reset({
      modifier: PointsModifier.DECREASE,
      points: 0
    })
    this.finalProgressPoints.set(this.currentStudentProgressPoints())
    this.onClose.emit()
    this.isLoading.set(false)
  }

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

  public calcFinalProgressPoints(): void {
    const studentProgressPoints = this.currentStudentProgressPoints()

    const modifier = this.modifierControl.getRawValue()
    const points = this.pointsControl.getRawValue()

    if (modifier === PointsModifier.INCREMENT) {
      this.finalProgressPoints.set(studentProgressPoints + points)
      return
    }

    this.finalProgressPoints.set(Math.max(0, studentProgressPoints - points))
  }

  get modifierControl(): AbstractControl<PointsModifier> {
    return this.modifyStudentProgressPointsForm.get(
      'modifier'
    ) as AbstractControl<PointsModifier>
  }

  get pointsControl(): AbstractControl<number> {
    return this.modifyStudentProgressPointsForm.get(
      'points'
    ) as AbstractControl<number>
  }

  private showModifyStudentProgressPointsErrorMessage(code: string) {
    const { summary, message } = modifyStudentProgressPointsErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showErrorMessage(summary: string, detail: string) {
    this.toastService.add({ severity: 'error', summary, detail })
  }
}
