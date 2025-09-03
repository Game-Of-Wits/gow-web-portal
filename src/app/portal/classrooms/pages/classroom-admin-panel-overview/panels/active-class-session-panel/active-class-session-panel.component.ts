import { Component, computed, inject, output, signal } from '@angular/core'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import {
  ChevronsUp,
  LucideAngularModule,
  Sparkles,
  Square,
  User,
  Users
} from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { Toast } from 'primeng/toast'
import { ClassSessionService } from '~/class-sessions/services/class-session/class-session.service'
import { ExperienceSessionService } from '~/class-sessions/services/experience-session/experience-session.service'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import { getWeekAndDayDifference } from '~/shared/utils/getWeekAndDayDifference'
import { StartShadowWarfareExperienceFormDialog } from './components/start-shadow-warfare-experience-form-dialog.component'

const endingOfClassSessionErrorMessages: ErrorMessages = {
  'class-session-not-active': {
    summary: 'Sesión de clase no activa',
    message: 'La sesión de clase no esta activada'
  },
  'active-experience-session-exist': {
    summary: 'Sesión de experiencia educativa ya activa',
    message: 'Se ha encontrado una sesión de experiencia educativa ya activa'
  },
  ...commonErrorMessages
}

@Component({
  selector: 'gow-active-class-session-panel',
  templateUrl: './active-class-session-panel.component.html',
  imports: [
    ProgressSpinnerModule,
    Toast,
    LucideAngularModule,
    StartShadowWarfareExperienceFormDialog
  ],
  providers: [MessageService]
})
export class ActiveClassSessionPanelComponent {
  public readonly teamIcon = Users
  public readonly sparklesIcon = Sparkles
  public readonly fastUpIcon = ChevronsUp
  public readonly userIcon = User
  public readonly stopIcon = Square

  private readonly classSessionService = inject(ClassSessionService)
  private readonly experienceService = inject(ExperienceSessionService)

  private readonly classroomContext = inject(ClassroomAdminPanelContextService)
  private readonly toastService = inject(MessageService)

  public isClassSessionEndingLoading = signal<boolean>(false)
  public isStartingShadowWarfareExperienceLoading = signal<boolean>(false)
  public isStartingMasteryRoadExperienceLoading = signal<boolean>(false)

  public isLoading = output<boolean>({ alias: 'loading' })
  public showStartShadowWarfareExperienceDialog = signal<boolean>(false)

  public activeAcademicPeriod = computed(() =>
    this.classroomContext.activeAcademicPeriod()
  )

  public weekAndDayDifference = computed(() => {
    const activeAcademicPeriod = this.classroomContext.activeAcademicPeriod()
    if (activeAcademicPeriod === null) return null
    return getWeekAndDayDifference(activeAcademicPeriod.startedAt)
  })

  public onOpenStartShadowWarfareExperience() {
    this.showStartShadowWarfareExperienceDialog.set(true)
  }

  public onCloseStartShadowWarfareExperience() {
    this.showStartShadowWarfareExperienceDialog.set(false)
  }

  public onStartMasteryRoadExperience() {
    const activeClassSession = this.classroomContext.classSession()

    if (activeClassSession === null) return

    this.isStartingMasteryRoadExperienceLoading.set(true)

    this.experienceService
      .startNewExperienceSession({
        classSessionId: activeClassSession.id,
        experience: EducationalExperience.MASTERY_ROAD
      })
      .then(experienceSession => {
        this.classroomContext.experienceSession.set(experienceSession)
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showStartMasteryRoadExperienceErrorMessage(error.code)
      })
      .finally(() => {
        this.isStartingMasteryRoadExperienceLoading.set(false)
      })
  }

  public async onEndingOfClassSession() {
    const activeAcademicPeriod = this.classroomContext.activeAcademicPeriod()

    if (activeAcademicPeriod === null) return

    this.isClassSessionEndingLoading.set(true)

    try {
      await this.classSessionService.endOfActiveClassSession(
        activeAcademicPeriod.id
      )
      this.isLoading.emit(true)
      this.classroomContext.classSession.set(null)
    } catch (err) {
      const error = err as ErrorResponse
      this.showEndingClassSessionErrorMessage(error.code)
    } finally {
      this.isClassSessionEndingLoading.set(false)
      this.isLoading.emit(false)
    }
  }

  private showStartMasteryRoadExperienceErrorMessage(code: string) {
    const { summary, message } = endingOfClassSessionErrorMessages[code]
    this.toastService.add({ severity: 'error', summary, detail: message })
  }

  private showEndingClassSessionErrorMessage(code: string) {
    const { summary, message } = endingOfClassSessionErrorMessages[code]
    this.toastService.add({ severity: 'error', summary, detail: message })
  }
}
