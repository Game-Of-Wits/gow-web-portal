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
  Check,
  EllipsisVertical,
  Gavel,
  LucideAngularModule,
  Minus,
  Plus,
  Square,
  X
} from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { TableModule } from 'primeng/table'
import { Toast } from 'primeng/toast'
import { Subject, takeUntil, tap } from 'rxjs'
import { StudentAbilityUsageCardComponent } from '~/abilities/components/student-ability-usage-card/student-ability-usage-card.component'
import { StudentAbilityUsageModel } from '~/abilities/models/StudentAbilityUsage.model'
import { StudentAbilityUsageService } from '~/abilities/services/student-ability-usage/student-ability-usage.service'
import { ExperienceSessionService } from '~/class-sessions/services/experience-session/experience-session.service'
import {
  ApplyPenaltyToStudentFormDialogComponent,
  ApplyPenaltyToStudentSuccess
} from '~/classrooms/components/apply-penalty-to-student-form-dialog/apply-penalty-to-student-form-dialog.component'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { LevelModel } from '~/levels/models/Level.model'
import { LevelService } from '~/levels/services/level/level.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { PointsModifier } from '~/shared/models/PointsModifier'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import { MasteryRoadStudentPeriodState } from '~/students/models/MasteryRoadStudentPeriodState'
import { StudentPeriodStateService } from '~/students/services/student-period-state/student-period-state.service'

const studentAbilityUsagesErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

const studentsErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

const endOfExperienceSessionErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

const modifyStudentProgressPointsErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

interface StudentPointsEdit {
  studentId: string
  originalPoints: number
  currentPoints: number
}

@Component({
  selector: 'gow-mastery-road-experience-panel',
  templateUrl: './mastery-road-experience-panel.component.html',
  imports: [
    StudentAbilityUsageCardComponent,
    TableModule,
    ProgressSpinnerModule,
    ButtonModule,
    NgOptimizedImage,
    Toast,
    ApplyPenaltyToStudentFormDialogComponent,
    LucideAngularModule
  ],
  providers: [MessageService]
})
export class MasteryRoadExperiencePanelComponent implements OnInit, OnDestroy {
  public readonly optionsIcon = EllipsisVertical
  public readonly stopIcon = Square
  public readonly plusIcon = Plus
  public readonly minusIcon = Minus
  public readonly applyIcon = Check
  public readonly cancelIcon = X
  public readonly modifyPointsIcon = Bolt
  public readonly applyPenaltyIcon = Gavel

  private destroy$ = new Subject<void>()

  private readonly studentPeriodStateService = inject(StudentPeriodStateService)
  private readonly experienceSessionService = inject(ExperienceSessionService)
  private readonly studentAbilityUsageService = inject(StudentAbilityUsageService)
  private readonly levelService = inject(LevelService)

  private readonly context = inject(ClassroomAdminPanelContextService)
  private readonly toastService = inject(MessageService)

  public isExperienceSessionEndingLoading = signal<boolean>(false)

  public isStudentsLoading = signal<boolean>(true)
  public students = signal<MasteryRoadStudentPeriodState[]>([])

  public isStudentAbilitiesUsagesLoading = signal<boolean>(true)
  public studentAbilityUsages = signal<StudentAbilityUsageModel[]>([])

  public levels = signal<LevelModel[]>([])
  public isLevelsLoading = signal<boolean>(true)

  public editingStudentsPoints = signal<Map<string, StudentPointsEdit>>(
    new Map()
  )
  public isSavingPoints = signal<boolean>(false)

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
    this.loadStudentAbilityUsages()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  public getLevelName(levelId: string): string | null {
    return this.levelsMap().get(levelId) ?? null
  }

  public onSuccessApplyPenaltyToStudent(result: ApplyPenaltyToStudentSuccess) {
    this.students.update(students => {
      const studentIndex = students.findIndex(
        student => student.id === result.studentPeriodStateId
      )

      if (studentIndex === -1) return students

      students[studentIndex].progressPoints = result.newStudentProgressPoints
      students[studentIndex].levelId = result.newLevelId

      return students
    })
  }

  public isEditingStudent(studentId: string): boolean {
    return this.editingStudentsPoints().has(studentId)
  }

  public getDisplayPoints(student: MasteryRoadStudentPeriodState): number {
    const editing = this.editingStudentsPoints().get(student.id)
    if (editing) return editing.currentPoints
    return student.progressPoints
  }

  public getEditingStudent(studentId: string): StudentPointsEdit | null {
    return this.editingStudentsPoints().get(studentId) ?? null
  }

  public onIncrementPoints(student: MasteryRoadStudentPeriodState) {
    this.editingStudentsPoints.update(map => {
      const newMap = new Map(map)
      const editing = newMap.get(student.id)

      if (editing) {
        newMap.set(student.id, {
          ...editing,
          currentPoints: editing.currentPoints + 1
        })
      } else {
        newMap.set(student.id, {
          studentId: student.id,
          originalPoints: student.progressPoints,
          currentPoints: student.progressPoints + 1
        })
      }

      return newMap
    })
  }

  public onDecrementPoints(student: MasteryRoadStudentPeriodState) {
    this.editingStudentsPoints.update(map => {
      const newMap = new Map(map)
      const editing = newMap.get(student.id)

      if (editing) {
        newMap.set(student.id, {
          ...editing,
          currentPoints: Math.max(0, editing.currentPoints - 1)
        })
      } else {
        newMap.set(student.id, {
          studentId: student.id,
          originalPoints: student.progressPoints,
          currentPoints: student.progressPoints - 1
        })
      }

      return newMap
    })
  }

  public onCancelEditingPoints(studentId: string) {
    this.editingStudentsPoints.update(map => {
      const newMap = new Map(map)
      newMap.delete(studentId)
      return newMap
    })
  }

  public async onApplyPointsChange(studentId: string) {
    const editing = this.editingStudentsPoints().get(studentId)
    const experienceSessionId = this.context.experienceSession()?.id ?? null

    if (!editing || experienceSessionId === null) return

    const pointsDifference = Math.abs(editing.currentPoints - editing.originalPoints)

    if (pointsDifference === 0) {
      this.onCancelEditingPoints(studentId)
      return
    }

    this.isSavingPoints.set(true)

    this.studentPeriodStateService
      .modifyStudentProgressPoints(studentId, experienceSessionId, {
        modifier:
          editing.originalPoints < editing.currentPoints
            ? PointsModifier.INCREMENT
            : PointsModifier.DECREASE,
        points: pointsDifference
      })
      .then(({ newLevelId, newProgressPoints }) => {
        this.students.update(students => {
          const studentIndex = students.findIndex(
            student => student.id === editing.studentId
          )

          if (studentIndex === -1) return students

          students[studentIndex].progressPoints = newProgressPoints
          students[studentIndex].levelId = newLevelId

          return students
        })

        this.toastService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Puntos modificados correctamente'
        })

        this.onCancelEditingPoints(studentId)
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showModifyStudentProgressPointsErrorMessage(error.code)
      })
      .finally(() => {
        this.isSavingPoints.set(false)
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

  private loadStudentAbilityUsages() {
    const experienceSession = this.context.experienceSession()

    if (experienceSession === null) return

    this.studentAbilityUsageService
      .watchByExperienceSession(experienceSession.id)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          if (this.isStudentAbilitiesUsagesLoading()) {
            this.isStudentAbilitiesUsagesLoading.set(false);
          }
        })
      )
      .subscribe({
        next: studentAbilityUsages => {
          this.studentAbilityUsages.set(studentAbilityUsages)
          this.isStudentAbilitiesUsagesLoading.set(false)
        },
        error: err => {
          this.isStudentAbilitiesUsagesLoading.set(false)
          const error = err as ErrorResponse
          this.onStudentAbilityUsagesErrorMessage(error.code)
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
    this.showErrorMessage(summary, message)
  }

  private onShowEndOfExperienceSessionErrorMessage(code: string) {
    const { summary, message } = endOfExperienceSessionErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showModifyStudentProgressPointsErrorMessage(code: string) {
    const { summary, message } = modifyStudentProgressPointsErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private onStudentAbilityUsagesErrorMessage(code: string) {
    const { summary, message } = studentAbilityUsagesErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showErrorMessage(summary: string, detail: string) {
    this.toastService.add({ severity: 'error', summary, detail })
  }
}
