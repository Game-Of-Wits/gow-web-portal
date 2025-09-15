import {
  Component,
  computed,
  HostListener,
  inject,
  input,
  OnInit,
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
import { MessageModule } from 'primeng/message'
import { TagModule } from 'primeng/tag'
import { Toast } from 'primeng/toast'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { PenaltyModel } from '~/penalties/models/Penalty.model'
import { PenaltyService } from '~/penalties/services/penalty/penalty.service'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import { SelectOption } from '~/shared/types/SelectOption'
import { StudentPeriodStateService } from '~/students/services/student-period-state/student-period-state.service'

const loadPenaltiesErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

const applyPenaltyToStudentErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

export interface ApplyPenaltyToStudentSuccess {
  studentPeriodStateId: string
  newStudentProgressPoints: number
  newLevelId: string
}

@Component({
  selector: 'gow-apply-penalty-to-student-form-dialog',
  templateUrl: './apply-penalty-to-student-form-dialog.component.html',
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    SelectFieldComponent,
    TagModule,
    MessageModule,
    Toast
  ],
  providers: [MessageService]
})
export class ApplyPenaltyToStudentFormDialogComponent implements OnInit {
  public readonly closeIcon = X

  private readonly studentPeriodStateService = inject(StudentPeriodStateService)
  private readonly penaltyService = inject(PenaltyService)

  private readonly classroomContext = inject(ClassroomAdminPanelContextService)
  private readonly toastService = inject(MessageService)

  public showDialog = input.required<boolean>({ alias: 'show' })
  public studentPeriodStateId = input<string | null>(null, {
    alias: 'studentPeriodStateId'
  })
  public studentFullName = input<string | null>(null, {
    alias: 'studentFullName'
  })
  public currentStudentProgressPoints = input<number>(0, {
    alias: 'currentProgressPoints'
  })

  public finalProgressPoints = signal<number>(
    this.currentStudentProgressPoints()
  )

  public isPenaltiesLoading = signal<boolean>(true)

  public penalties = signal<PenaltyModel[]>([])
  public penaltiesOptions = computed<SelectOption[]>(() => {
    return this.penalties().map(penalty => ({
      code: penalty.id,
      name: `${penalty.name} - ${penalty.reducePoints}`
    }))
  })

  public isApplingPenaltyLoading = signal<boolean>(false)

  public onClose = output<void>({ alias: 'close' })
  public onSuccess = output<ApplyPenaltyToStudentSuccess>({
    alias: 'success'
  })

  public penaltyControl = new FormControl<string | null>(null, {
    validators: [Validators.required]
  })

  ngOnInit(): void {
    this.penaltyControl.valueChanges.subscribe(value => {
      if (value === null) return
      this.calcFinalProgressPoints(value)
    })

    const classroomId = this.classroomContext.classroom()?.id ?? null

    if (classroomId === null) return

    this.penaltyService
      .getAllPenaltiesByClassroomAsync(classroomId)
      .then(penalties => {
        this.penalties.set(penalties)
        this.isPenaltiesLoading.set(false)
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showLoadPenaltiesErrorMessage(error.code)
        this.isApplingPenaltyLoading.set(false)
      })
  }

  public onApplyPenaltyToStudent() {
    const experienceSessionId =
      this.classroomContext.experienceSession()?.id ?? null
    const studentPeriodStateId = this.studentPeriodStateId()
    const penaltyId = this.penaltyControl.getRawValue()

    if (
      this.penaltyControl.invalid ||
      studentPeriodStateId === null ||
      penaltyId === null ||
      experienceSessionId === null
    )
      return

    this.isApplingPenaltyLoading.set(true)

    this.studentPeriodStateService
      .applyPenaltytoStudentPeriodStateById(
        studentPeriodStateId,
        experienceSessionId,
        penaltyId
      )
      .then(({ newProgressPoints, newLevelId }) => {
        this.onSuccess.emit({
          newStudentProgressPoints: newProgressPoints,
          studentPeriodStateId,
          newLevelId
        })
        this.onCloseDialog()
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showApplyPenaltyToStudentErrorMessage(error.code)
        this.isApplingPenaltyLoading.set(false)
      })
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.onCloseDialog()
  }

  public onCloseDialog() {
    this.onClose.emit()
    this.penaltyControl.reset(null)
    this.isApplingPenaltyLoading.set(false)
  }

  public hasErrorValidation(
    control: AbstractControl | null,
    validationKey: string
  ) {
    return control?.pristine || control?.hasError(validationKey)
  }

  private calcFinalProgressPoints(penaltyId: string) {
    const penalty = this.penalties().find(penalty => penalty.id === penaltyId)

    if (penalty === undefined) return

    const studentHealthPoints = this.currentStudentProgressPoints()

    this.finalProgressPoints.set(
      Math.max(0, studentHealthPoints - penalty.reducePoints)
    )
  }

  private showApplyPenaltyToStudentErrorMessage(code: string) {
    const { summary, message } = applyPenaltyToStudentErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showLoadPenaltiesErrorMessage(code: string) {
    const { summary, message } = loadPenaltiesErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showErrorMessage(summary: string, detail: string) {
    this.toastService.add({ severity: 'error', summary, detail })
  }
}
