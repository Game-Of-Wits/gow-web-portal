import { NgOptimizedImage } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { MessageService } from 'primeng/api'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { Toast } from 'primeng/toast'
import { firstValueFrom } from 'rxjs'
import { AcademicPeriodModel } from '~/academic-periods/models/AcademicPeriod.model'
import { AcademicPeriodService } from '~/academic-periods/services/academic-period/academic-period.service'
import { ClassSessionModel } from '~/class-sessions/models/ClassSession.model'
import { ExperienceSessionModel } from '~/class-sessions/models/ExperienceSession.model'
import { ClassSessionService } from '~/class-sessions/services/class-session/class-session.service'
import { ExperienceSessionService } from '~/class-sessions/services/experience-session/experience-session.service'
import { ClassroomAdminPanelLoadingComponent } from '~/classrooms/components/ui/classroom-admin-panel-loading.component'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import { StudentProfileModel } from '~/student-profiles/models/StudentProfile.model'
import { ActiveClassSessionPanelComponent } from './panels/active-class-session-panel/active-class-session-panel.component'
import { MasteryRoadExperiencePanelComponent } from './panels/experiences/mastery-road-experience-panel/mastery-road-experience-panel.component'
import { ShadowWarfareExperiencePanelComponent } from './panels/experiences/shadow-warfare-experience-panel/shadow-warfare-experience-panel.component'
import { StartClassSessionPanelComponent } from './panels/start-class-session-panel.component'

const classroomAdminPanelOverviewErrorMessages: ErrorMessages = {
  'school-not-found': {
    summary: 'Escuela no encontrada',
    message: 'La escuela de la clase no ha sido encontrada'
  },
  ...commonErrorMessages
}

@Component({
  selector: 'gow-classroom-admin-panel-overview',
  templateUrl: './classroom-admin-panel-overview.component.html',
  imports: [
    NgOptimizedImage,
    ProgressSpinnerModule,
    Toast,
    StartClassSessionPanelComponent,
    ActiveClassSessionPanelComponent,
    ShadowWarfareExperiencePanelComponent,
    MasteryRoadExperiencePanelComponent,
    ClassroomAdminPanelLoadingComponent
  ],
  providers: [MessageService]
})
export class ClassroomAdminPanelOverviewPageComponent implements OnInit {
  public readonly masteryRoadExperience = EducationalExperience.MASTERY_ROAD
  public readonly shadowWarfareExperience = EducationalExperience.SHADOW_WARFARE

  public readonly context = inject(ClassroomAdminPanelContextService)

  private readonly academicPeriodService = inject(AcademicPeriodService)
  private readonly classSessionService = inject(ClassSessionService)
  private readonly experienceSessionService = inject(ExperienceSessionService)

  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly toastService = inject(MessageService)

  public students = signal<StudentProfileModel[]>([])
  public isLoading = signal<boolean>(false)

  ngOnInit(): void {
    const schoolId =
      this.activatedRoute.parent?.parent?.snapshot.paramMap.get('schoolId') ??
      null

    if (schoolId === null) {
      this.onShowErrorMessage('school-not-found')
      return
    }

    this.verifyClassroomOverviewState(schoolId)
  }

  public onSetLoading(value: boolean) {
    this.isLoading.set(value)
  }

  private async verifyClassroomOverviewState(schoolId: string) {
    this.isLoading.set(true)

    let activeAcademicPeriod: AcademicPeriodModel
    try {
      activeAcademicPeriod = await firstValueFrom(
        this.academicPeriodService.getSchoolActiveAcademicPeriod(schoolId)
      )
      this.context.academicPeriod.set(activeAcademicPeriod)
    } catch (err) {
      const error = err as ErrorResponse
      if (error.code === 'active-academic-period-not-exist') {
        this.isLoading.set(false)
        return
      }

      this.onShowErrorMessage(error.code)
      return
    }

    const classroomId = this.context.classroom()?.id ?? null

    if (classroomId === null) {
      this.isLoading.set(false)
      return
    }

    let activeClassSession: ClassSessionModel
    try {
      activeClassSession = await firstValueFrom(
        this.classSessionService.getActiveClassSession({
          classroomId,
          academicPeriodId: activeAcademicPeriod.id
        })
      )
      this.context.classSession.set(activeClassSession)
    } catch (err) {
      const error = err as ErrorResponse

      if (error.code === 'active-class-session-not-exist') {
        this.isLoading.set(false)
        return
      }

      this.onShowErrorMessage(error.code)
      return
    }

    let activeExperienceSession: ExperienceSessionModel
    try {
      activeExperienceSession = await firstValueFrom(
        this.experienceSessionService.getActiveExperienceSession(
          activeClassSession.id
        )
      )
      this.context.experienceSession.set(activeExperienceSession)
      this.isLoading.set(false)
    } catch (err) {
      const error = err as ErrorResponse

      if (error.code === 'active-experience-session-not-exist') {
        this.isLoading.set(false)
        return
      }

      this.onShowErrorMessage(error.code)
    }
  }

  private onShowErrorMessage(code: string) {
    const { summary, message } = classroomAdminPanelOverviewErrorMessages[code]
    this.toastService.add({ summary, detail: message, severity: 'error' })
  }
}
