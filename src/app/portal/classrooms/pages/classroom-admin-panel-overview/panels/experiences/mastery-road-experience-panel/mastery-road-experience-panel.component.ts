import { NgOptimizedImage } from '@angular/common'
import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  output,
  signal
} from '@angular/core'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import {
  Bolt,
  EllipsisVertical,
  Gavel,
  LucideAngularModule,
  Square
} from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { TableModule } from 'primeng/table'
import { Toast } from 'primeng/toast'
import { Subject, takeUntil } from 'rxjs'
import { AbilityUseCardComponent } from '~/abilities/components/ability-use-card/ability-use-card.component'
import { AbilityUseModel } from '~/abilities/models/AbilityUse.model'
import { AbilityUseService } from '~/abilities/services/ability-use/ability-use.service'
import { ExperienceSessionService } from '~/class-sessions/services/experience-session/experience-session.service'
import {
  ApplyPenaltyToStudentFormDialogComponent,
  ApplyPenaltyToStudentSuccess
} from '~/classrooms/components/apply-penalty-to-student-form-dialog/apply-penalty-to-student-form-dialog.component'
import {
  ModifyStudentProgressPointsFormDialogComponent,
  ModifyStudentProgressPointsSuccess
} from '~/classrooms/components/modify-student-progress-points-form-dialog/modify-student-progress-points-form-dialog.component'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { LevelModel } from '~/levels/models/Level.model'
import { LevelService } from '~/levels/services/level/level.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import { MasteryRoadStudentPeriodState } from '~/students/models/MasteryRoadStudentPeriodState'
import { StudentPeriodStateService } from '~/students/services/student-period-state/student-period-state.service'

const abilityUsesErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

const studentsErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

const endOfExperienceSessionErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

@Component({
  selector: 'gow-mastery-road-experience-panel',
  templateUrl: './mastery-road-experience-panel.component.html',
  imports: [
    AbilityUseCardComponent,
    TableModule,
    ProgressSpinnerModule,
    ButtonModule,
    Toast,
    NgOptimizedImage,
    ModifyStudentProgressPointsFormDialogComponent,
    ApplyPenaltyToStudentFormDialogComponent,
    LucideAngularModule
  ],
  providers: [MessageService]
})
export class MasteryRoadExperiencePanelComponent implements OnInit, OnDestroy {
  public readonly optionsIcon = EllipsisVertical
  public readonly stopIcon = Square
  public readonly modifyPointsIcon = Bolt
  public readonly applyPenaltyIcon = Gavel

  private destroy$ = new Subject<void>()

  private readonly studentPeriodStateService = inject(StudentPeriodStateService)
  private readonly experienceSessionService = inject(ExperienceSessionService)
  private readonly abilityUseService = inject(AbilityUseService)
  private readonly levelService = inject(LevelService)

  private readonly context = inject(ClassroomAdminPanelContextService)
  private readonly toastService = inject(MessageService)

  public isExperienceSessionEndingLoading = signal<boolean>(false)

  public isStudentsLoading = signal<boolean>(true)
  public students = signal<MasteryRoadStudentPeriodState[]>([])

  public isAbilityUsesLoading = signal<boolean>(true)
  public abilityUses = signal<AbilityUseModel[]>([])

  public levels = signal<LevelModel[]>([])
  public isLevelsLoading = signal<boolean>(true)

  public showModifyStudentProgressPointsDialog = signal<boolean>(false)
  public modifyStudentProgressPointsSelected = signal<{
    studentPeriodStateId: string | null
    fullName: string | null
    currentProgressPoints: number
  }>({
    studentPeriodStateId: null,
    fullName: null,
    currentProgressPoints: 0
  })

  public showApplyStudentPenaltyDialog = signal<boolean>(false)
  public applyStudentPenaltySelected = signal<{
    studentPeriodStateId: string | null
    fullName: string | null
    currentProgressPoints: number
  }>({
    studentPeriodStateId: null,
    fullName: null,
    currentProgressPoints: 0
  })

  public readonly levelsMap = computed(
    () => new Map(this.levels().map(level => [level.id, level.name]))
  )

  public adminPanelOverviewLoading = output<boolean>({ alias: 'loading' })

  ngOnInit(): void {
    this.loadLevels()
    this.loadStudents()
    this.loadAbilityUses()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  public getLevelName(levelId: string): string | null {
    return this.levelsMap().get(levelId) ?? null
  }

  public onSuccessModifyStudentProgressPoints(
    result: ModifyStudentProgressPointsSuccess
  ) {
    this.students.update(students => {
      const studentIndex = students.findIndex(
        student => student.id === result.studentPeriodStateId
      )

      if (studentIndex === -1) return students

      students[studentIndex].progressPoints = result.newStudentProgressPoints

      return students
    })
  }

  public onSuccessApplyPenaltyToStudent(result: ApplyPenaltyToStudentSuccess) {
    this.students.update(students => {
      const studentIndex = students.findIndex(
        student => student.id === result.studentPeriodStateId
      )

      if (studentIndex === -1) return students

      students[studentIndex].progressPoints = result.newStudentProgressPoints

      return students
    })
  }

  public onOpenModifyStudentProgressPointsDialog(studentPeriodStateId: string) {
    const student = this.students().find(
      student => student.id === studentPeriodStateId
    )

    if (student === undefined) return

    this.showModifyStudentProgressPointsDialog.set(true)
    this.modifyStudentProgressPointsSelected.set({
      fullName: student.firstName + ' ' + student.lastName,
      currentProgressPoints: student.progressPoints,
      studentPeriodStateId: student.id
    })
  }

  public onCloseModifyStudentProgressPointsDialog() {
    this.showModifyStudentProgressPointsDialog.set(false)
    this.modifyStudentProgressPointsSelected.set({
      studentPeriodStateId: null,
      currentProgressPoints: 0,
      fullName: null
    })
  }

  public onOpenApplyStudentPenaltyDialog(studentPeriodStateId: string) {
    const student = this.students().find(
      student => student.id === studentPeriodStateId
    )

    if (student === undefined) return

    this.showApplyStudentPenaltyDialog.set(true)
    this.applyStudentPenaltySelected.set({
      fullName: student.firstName + ' ' + student.lastName,
      currentProgressPoints: student.progressPoints,
      studentPeriodStateId: student.id
    })
  }

  public onCloseApplyStudentPenaltyDialog() {
    this.showApplyStudentPenaltyDialog.set(false)
    this.applyStudentPenaltySelected.set({
      studentPeriodStateId: null,
      currentProgressPoints: 0,
      fullName: null
    })
  }

  public onEndOfExperienceSession() {
    const experienceSessionId = this.context.experienceSession()?.id ?? null

    if (experienceSessionId === null) return

    this.isExperienceSessionEndingLoading.set(true)

    this.experienceSessionService
      .endOfExperienceSession(experienceSessionId)
      .then(() => {
        this.adminPanelOverviewLoading.emit(true)
        this.context.experienceSession.set(null)
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.onShowEndOfExperienceSessionErrorMessage(error.code)
      })
      .finally(() => {
        this.isExperienceSessionEndingLoading.set(false)
        this.adminPanelOverviewLoading.emit(false)
      })
  }

  private loadAbilityUses() {
    const experienceSession = this.context.experienceSession()

    if (experienceSession === null) return

    this.isAbilityUsesLoading.set(true)

    this.abilityUseService
      .getAllAbilityUsesByExperienceAndExperienceSessionId({
        experience: experienceSession.experience,
        experienceSessionId: experienceSession.id
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: abilityUses => {
          this.abilityUses.set(abilityUses)
          this.isAbilityUsesLoading.set(false)
        },
        error: err => {
          const error = err as ErrorResponse
          this.onShowAbilityUsesLoadingErrorMessage(error.code)
        }
      })
  }

  private loadStudents() {
    const classroomId = this.context.classroom()?.id ?? null
    const academicPeriodId = this.context.activeAcademicPeriod()?.id ?? null

    if (classroomId === null || academicPeriodId === null) return

    this.isStudentsLoading.set(true)

    this.studentPeriodStateService
      .getAllMasteryRoadStudentPeriodStates({ classroomId, academicPeriodId })
      .subscribe({
        next: students => {
          this.students.set(students)
          this.isStudentsLoading.set(false)
        },
        error: err => {
          const error = err as ErrorResponse
          this.onShowStudentsLoadingErrorMessage(error.code)
        }
      })
  }

  private loadLevels() {
    const classroomId = this.context.classroom()?.id ?? null

    if (classroomId === null) return

    this.isStudentsLoading.set(true)

    this.levelService.getAllLevelsByClassroom(classroomId).subscribe({
      next: levels => {
        this.levels.set(levels)
        this.isLevelsLoading.set(false)
      },
      error: err => {
        const error = err as ErrorResponse
        this.onShowStudentsLoadingErrorMessage(error.code)
      }
    })
  }

  private onShowStudentsLoadingErrorMessage(code: string) {
    const { summary, message } = studentsErrorMessages[code]
    this.toastService.add({ summary, detail: message })
  }

  private onShowEndOfExperienceSessionErrorMessage(code: string) {
    const { summary, message } = endOfExperienceSessionErrorMessages[code]
    this.toastService.add({ summary, detail: message })
  }

  private onShowAbilityUsesLoadingErrorMessage(code: string) {
    const { summary, message } = abilityUsesErrorMessages[code]
    this.toastService.add({ summary, detail: message })
  }
}
