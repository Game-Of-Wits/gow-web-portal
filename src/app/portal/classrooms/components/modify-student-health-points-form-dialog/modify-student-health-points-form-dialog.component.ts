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
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { modifyStudentHealthPointsForm } from '~/classrooms/forms/modifyStudentHealthPointsForm'
import { NumberFieldComponent } from '~/shared/components/ui/number-field/number-field.component'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { pointsModifierOptions } from '~/shared/data/pointsModifierOptions'
import { PointsModifier } from '~/shared/models/PointsModifier'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import { StudentPeriodStateService } from '~/students/services/student-period-state/student-period-state.service'

const modifyStudentHealthPointsErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

export interface ModifyStudentHealthPointsSuccess {
  studentPeriodStateId: string
  newStudentHealthPoints: number
}

@Component({
  selector: 'gow-modify-student-health-points-form-dialog',
  templateUrl: './modify-student-health-points-form-dialog.component.html',
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
export class ModifyStudentHealthPointsFormDialogComponent implements OnInit {
  public readonly closeIcon = X
  public readonly dangerIcon = AlertTriangle

  public readonly pointsModifierOptions = pointsModifierOptions
  public readonly pointsModifier = PointsModifier

  private readonly studentPeriodStateService = inject(StudentPeriodStateService)

  private readonly toastService = inject(MessageService)
  private readonly classroomContext = inject(ClassroomAdminPanelContextService)

  public showDialog = input.required<boolean>({ alias: 'show' })
  public studentPeriodStateId = input<string | null>(null, {
    alias: 'studentPeriodStateId'
  })
  public studentFullName = input<string | null>(null, {
    alias: 'studentFullName'
  })
  public currentStudentHealthPoints = input<number>(0, {
    alias: 'currentStudentHealthPoints'
  })

  public isLoading = signal<boolean>(false)
  public finalHealthPoints = signal<number>(-1)

  public onClose = output<void>({ alias: 'close' })
  public onSuccess = output<ModifyStudentHealthPointsSuccess>({
    alias: 'success'
  })

  public modifyStudentHealthPointsForm = modifyStudentHealthPointsForm()

  ngOnInit(): void {
    this.modifyStudentHealthPointsForm.valueChanges.subscribe(() => {
      this.calcFinalHealthPoints()
    })
  }

  public onModifyStudentHealthPoints() {
    const studentPeriodStateId = this.studentPeriodStateId()

    if (
      this.modifyStudentHealthPointsForm.invalid ||
      studentPeriodStateId === null
    )
      return

    const formData = this.modifyStudentHealthPointsForm.getRawValue()

    this.isLoading.set(true)

    this.studentPeriodStateService
      .modifyStudentHealthPoints(studentPeriodStateId, {
        modifier: formData.modifier,
        points: formData.points
      })
      .then(newStudentHealthPoints => {
        this.onSuccess.emit({ studentPeriodStateId, newStudentHealthPoints })
        this.onCloseDialog()
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showModifyStudentHealthPointsErrorMessage(error.code)
        this.isLoading.set(false)
      })
  }

  public onCloseDialog() {
    this.onClose.emit()
    this.modifyStudentHealthPointsForm = modifyStudentHealthPointsForm()
    this.isLoading.set(false)
  }

  public hasErrorValidation(
    control: AbstractControl | null,
    validationKey: string
  ) {
    return control?.pristine || control?.hasError(validationKey)
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.onCloseDialog()
  }

  public calcFinalHealthPoints(): void {
    const maxHealthPoints =
      this.classroomContext.classroom()?.experiences.SHADOW_WARFARE
        .healthPointsBase

    if (maxHealthPoints === undefined) {
      this.finalHealthPoints.set(this.currentStudentHealthPoints())
      return
    }

    const studentHealthPoints = this.currentStudentHealthPoints()
    const modifier = this.modifierControl.getRawValue()
    const points = this.pointsControl.getRawValue()

    if (modifier === null || points === null) {
      this.finalHealthPoints.set(this.currentStudentHealthPoints())
      return
    }

    if (modifier === PointsModifier.INCREMENT) {
      this.finalHealthPoints.set(
        Math.min(maxHealthPoints, studentHealthPoints + points)
      )
      return
    }

    this.finalHealthPoints.set(Math.max(0, studentHealthPoints - points))
  }

  get modifierControl(): AbstractControl<PointsModifier> {
    return this.modifyStudentHealthPointsForm.get(
      'modifier'
    ) as AbstractControl<PointsModifier>
  }

  get pointsControl(): AbstractControl<number> {
    return this.modifyStudentHealthPointsForm.get(
      'points'
    ) as AbstractControl<number>
  }

  private showModifyStudentHealthPointsErrorMessage(code: string) {
    const { summary, message } = modifyStudentHealthPointsErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showErrorMessage(summary: string, detail: string) {
    this.toastService.add({ severity: 'error', summary, detail })
  }
}
