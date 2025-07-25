import {
  Component,
  computed,
  inject,
  input,
  output,
  signal
} from '@angular/core'
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
import { AcademicPeriodModel } from '~/academic-periods/models/AcademicPeriod.model'
import { ClassSessionModel } from '~/class-sessions/models/ClassSession.model'
import { ClassSessionService } from '~/class-sessions/services/class-session/class-session.service'
import { ExperienceSessionService } from '~/class-sessions/services/experience-session/experience-session.service'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import { getWeekAndDayDifference } from '~/shared/utils/getWeekAndDayDifference'

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
  imports: [ProgressSpinnerModule, Toast, LucideAngularModule],
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

  private readonly context = inject(ClassroomAdminPanelContextService)
  private readonly toastService = inject(MessageService)

  public isClassSessionEndingLoading = signal<boolean>(false)
  public isStartingShadowWarfareExperienceLoading = signal<boolean>(false)
  public isStartingMasteryRoadExperienceLoading = signal<boolean>(false)

  public activeClassSession = input.required<ClassSessionModel>({
    alias: 'classSession'
  })
  public activeAcademicPeriod = input.required<AcademicPeriodModel>({
    alias: 'academicPeriod'
  })

  public isLoading = output<boolean>({ alias: 'loading' })

  public weekAndDayDifference = computed(() =>
    getWeekAndDayDifference(this.activeAcademicPeriod().startedAt)
  )

  public async onEndingOfClassSession() {
    this.isClassSessionEndingLoading.set(true)

    try {
      await this.classSessionService.endOfActiveClassSession(
        this.activeClassSession().id
      )
      this.isLoading.emit(true)
      this.context.classSession.set(null)
    } catch (err) {
      const error = err as ErrorResponse
      this.onShowErrorMessage(error.code)
    } finally {
      this.isClassSessionEndingLoading.set(false)
      this.isLoading.emit(false)
    }
  }

  public async onStartShadowWarfareExperience() {
    this.isStartingShadowWarfareExperienceLoading.set(true)

    try {
      const experienceSession =
        await this.experienceService.startNewExperienceSession({
          classSessionId: this.activeClassSession().id,
          experience: EducationalExperience.SHADOW_WARFARE
        })
      this.isLoading.emit(true)
      this.context.experienceSession.set(experienceSession)
    } catch (err) {
      const error = err as ErrorResponse
      this.onShowErrorMessage(error.code)
    } finally {
      this.isStartingShadowWarfareExperienceLoading.set(false)
      this.isLoading.emit(false)
    }
  }

  public async onStartMasteryRoadExperience() {
    this.isStartingMasteryRoadExperienceLoading.set(true)

    try {
      const experienceSession =
        await this.experienceService.startNewExperienceSession({
          classSessionId: this.activeClassSession().id,
          experience: EducationalExperience.MASTERY_ROAD
        })
      this.isLoading.emit(true)
      this.context.experienceSession.set(experienceSession)
    } catch (err) {
      const error = err as ErrorResponse
      this.onShowErrorMessage(error.code)
    } finally {
      this.isStartingMasteryRoadExperienceLoading.set(false)
      this.isLoading.emit(false)
    }
  }

  private onShowErrorMessage(code: string) {
    const { summary, message } = endingOfClassSessionErrorMessages[code]
    this.toastService.add({ severity: 'error', summary, detail: message })
  }
}
