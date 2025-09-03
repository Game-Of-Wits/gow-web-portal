import { Component, computed, inject, OnInit, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { AtSign, LucideAngularModule, Phone } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { CardModule } from 'primeng/card'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { SelectModule } from 'primeng/select'
import { TagModule } from 'primeng/tag'
import { Toast } from 'primeng/toast'
import { AcademicPeriodModel } from '~/academic-periods/models/AcademicPeriod.model'
import { AcademicPeriodService } from '~/academic-periods/services/academic-period/academic-period.service'
import { ClassroomAdminPanelLoadingComponent } from '~/classrooms/components/ui/classroom-admin-panel-loading.component'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { PageHeaderComponent } from '~/shared/components/ui/page-header/page-header.component'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { DefaultSchoolStore } from '~/shared/store/default-school.store'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import { SelectOption } from '~/shared/types/SelectOption'
import { formatDate } from '~/shared/utils/formatDate'
import { StudentProfileModel } from '~/student-profiles/models/StudentProfile.model'
import { StudentProfileService } from '~/student-profiles/services/student-profile/student-profile.service'
import {
  MasteryRoadExperienceState,
  ShadowWarfareExperienceState,
  StudentPeriodStateExperience,
  StudentPeriodStatesModel
} from '~/students/models/StudentPeriodStates.model'
import { StudentPeriodStateService } from '~/students/services/student-period-state/student-period-state.service'
import { MasteryRoadCardComponent } from './components/mastery-road-card.component'
import { ShadowWarfareCardComponent } from './components/shadow-warfare-card.component'

const academicPeriodsErrorMessages: ErrorMessages = {
  'school-not-exist': {
    summary: 'Colegio no encontrado',
    message: 'El colegio no ha podido ser encontrado'
  },
  ...commonErrorMessages
}

const studentPeriodStatesErrorMessages: ErrorMessages = {
  'student-not-exist': {
    summary: 'Estudiante no encontrado',
    message: 'El estudiante no ha podido ser encontrado'
  },
  ...commonErrorMessages
}

const studentInformationErrorMessages: ErrorMessages = {
  'student-profile-not-exist': {
    summary: 'Perfil de estudiante no encontrado',
    message: 'El perfil del estudiante no ha podido ser encontrado'
  },
  ...commonErrorMessages
}

@Component({
  selector: 'gow-classroom-admin-panel-student-details',
  templateUrl: './classroom-admin-panel-student-details.component.html',
  imports: [
    ReactiveFormsModule,
    ProgressSpinnerModule,
    ClassroomAdminPanelLoadingComponent,
    ShadowWarfareCardComponent,
    MasteryRoadCardComponent,
    Toast,
    CardModule,
    SelectModule,
    PageHeaderComponent,
    SelectFieldComponent,
    TagModule,
    LucideAngularModule
  ],
  providers: [MessageService]
})
export class ClassroomAdminPanelStudentDetailsPageComponent implements OnInit {
  public readonly phoneIcon = Phone
  public readonly emailIcon = AtSign

  public readonly educationalExperience = EducationalExperience

  private readonly studentProfileService = inject(StudentProfileService)
  private readonly academicPeriodService = inject(AcademicPeriodService)
  private readonly studentPeriodStateService = inject(StudentPeriodStateService)

  public readonly defaultSchoolStore = inject(DefaultSchoolStore)
  public readonly context = inject(ClassroomAdminPanelContextService)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly toastService = inject(MessageService)

  public studentInformation = signal<StudentProfileModel | null>(null)
  public academicPeriods = signal<AcademicPeriodModel[]>([])
  public studentPeriodStates = signal<StudentPeriodStatesModel[]>([])

  public academicPeriodOptions = signal<SelectOption[]>([])

  public isStudentInformationLoading = signal<boolean>(true)
  public isStudentStadisticLoading = signal<boolean>(true)
  public isStudentPeriodStadisticLoading = signal<boolean>(false)

  public selectAcademicPeriodControl = new FormControl<string>(
    { value: '', disabled: true },
    [Validators.required]
  )

  public defaultBackPath = {
    commands: ['../'],
    extras: { relativeTo: this.activatedRoute }
  }

  public selectedAcademicPeriodId = signal<string | null>(
    this.selectAcademicPeriodControl.value
  )

  public studentPeriodStateSelected = computed(() => {
    return this.studentPeriodStates().find(
      period => period.academicPeriodId === this.selectedAcademicPeriodId()
    )
  })

  ngOnInit(): void {
    const studentProfileId =
      this.activatedRoute.snapshot.paramMap.get('studentId')

    if (studentProfileId === null) return

    this.selectAcademicPeriodControl.disable()
    this.loadStudentInformation(studentProfileId)

    this.selectAcademicPeriodControl.valueChanges.subscribe(value => {
      this.selectedAcademicPeriodId.set(value)
    })
  }

  public getMasteryRoadState(
    experiences: Map<EducationalExperience, StudentPeriodStateExperience>
  ) {
    return experiences.get(
      EducationalExperience.MASTERY_ROAD
    ) as MasteryRoadExperienceState
  }

  public getShadowWarfareState(
    experiences: Map<EducationalExperience, StudentPeriodStateExperience>
  ) {
    return experiences.get(
      EducationalExperience.SHADOW_WARFARE
    ) as ShadowWarfareExperienceState
  }

  private loadStudentInformation(studentProfileId: string) {
    this.studentProfileService
      .getStudentProfileByIdAsync(studentProfileId)
      .then(async studentProfile => {
        this.studentInformation.set(studentProfile)
        this.isStudentInformationLoading.set(false)

        Promise.all([
          this.loadStudentPeriodStates(studentProfile.id),
          this.loadSchoolAcademicPeriods()
        ])
          .then(() => {
            const periods = this.academicPeriods()
            const states = this.studentPeriodStates()

            if (states.length === 0) {
              this.isStudentStadisticLoading.set(false)
              return
            }

            const periodIdsWithStates = new Set(
              states.map(s => s.academicPeriodId)
            )

            const studentAcademicPeriods = periods.filter(period =>
              periodIdsWithStates.has(period.id)
            )

            this.academicPeriodOptions.set(
              studentAcademicPeriods.map(period => ({
                code: period.id,
                name: `${period.name} (${formatDate(period.startedAt)} - ${period.endedAt === null ? 'Actualidad' : formatDate(period.endedAt)})`
              }))
            )
            this.selectAcademicPeriodControl.setValue(
              String(this.academicPeriodOptions()[0].code)
            )

            this.isStudentStadisticLoading.set(false)
          })
          .catch(() => {
            this.toastService.add({
              severity: 'error',
              summary: 'Error en la carga de las estadisticas',
              detail:
                'No se han podido cargar los datos de las estadisticas del estudiante, pruebe intentandolo más tarde'
            })
          })
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showStudentInformationLoadingErrorMessage(error.code)
      })
  }

  private async loadStudentPeriodStates(studentProfileId: string) {
    try {
      const studentPeriodStates =
        await this.studentPeriodStateService.getAllStudentPeriodStatesByStudentId(
          studentProfileId
        )

      this.studentPeriodStates.set(studentPeriodStates)
    } catch (err) {
      const error = err as ErrorResponse
      this.showStudentPeriodStatesLoadingErrorMessage(error.code)
    }
  }

  private async loadSchoolAcademicPeriods() {
    const schoolId = this.defaultSchoolStore.school()?.id ?? null

    if (schoolId === null) return

    try {
      const academicPeriods =
        await this.academicPeriodService.getAllAcademicPeriodsBySchool(schoolId)

      this.academicPeriods.set(academicPeriods)
    } catch (err) {
      const error = err as ErrorResponse
      this.showAcademicPeriodsLoadingErrorMessage(error.code)
    }
  }

  private showAcademicPeriodsLoadingErrorMessage(code: string) {
    const { summary, message } = academicPeriodsErrorMessages[code]
    this.toastService.add({ severity: 'error', summary, detail: message })
  }

  private showStudentPeriodStatesLoadingErrorMessage(code: string) {
    const { summary, message } = studentPeriodStatesErrorMessages[code]
    this.toastService.add({ severity: 'error', summary, detail: message })
  }

  private showStudentInformationLoadingErrorMessage(code: string) {
    const { summary, message } = studentInformationErrorMessages[code]
    this.toastService.add({ severity: 'error', summary, detail: message })
  }
}
