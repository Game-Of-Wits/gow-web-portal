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
import { EllipsisVertical, LucideAngularModule, Square } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { TableModule } from 'primeng/table'
import { Toast } from 'primeng/toast'
import { Subject, takeUntil } from 'rxjs'
import { AbilityUseCardComponent } from '~/abilities/components/ability-use-card/ability-use-card.component'
import { AbilityUseModel } from '~/abilities/models/AbilityUse.model'
import { AbilityUseService } from '~/abilities/services/ability-use/ability-use.service'
import { CharacterModel } from '~/characters/models/Character.model'
import { CharacterService } from '~/characters/services/character/character.service'
import { ExperienceSessionModel } from '~/class-sessions/models/ExperienceSession.model'
import { ExperienceSessionService } from '~/class-sessions/services/experience-session/experience-session.service'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import { ShadowWarfareStudentPeriodState } from '~/students/models/ShadowWarfareStudentPeriodState'
import { StudentPeriodStateService } from '~/students/services/student-period-state/student-period-state.service'
import { TeamModel } from '~/teams/models/Team.model'
import { TeamService } from '~/teams/services/team/team.service'

const abilityUsesErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

const studentsErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

const endOfExperienceSessionErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

const charactersLoadingErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

const teamsLoadingErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

// TODO: Componetizar todo este panel
@Component({
  selector: 'gow-shadow-warfare-experience-panel',
  templateUrl: './shadow-warfare-experience-panel.component.html',
  imports: [
    AbilityUseCardComponent,
    TableModule,
    ProgressSpinnerModule,
    ButtonModule,
    Toast,
    NgOptimizedImage,
    LucideAngularModule
  ],
  providers: [MessageService]
})
export class ShadowWarfareExperiencePanelComponent
  implements OnInit, OnDestroy
{
  public readonly optionsIcon = EllipsisVertical
  public readonly stopIcon = Square

  private destroy$ = new Subject<void>()

  private readonly studentPeriodStateService = inject(StudentPeriodStateService)
  private readonly experienceSessionService = inject(ExperienceSessionService)
  private readonly abilityUseService = inject(AbilityUseService)
  private readonly characterService = inject(CharacterService)
  private readonly teamService = inject(TeamService)

  private readonly context = inject(ClassroomAdminPanelContextService)
  private readonly toastService = inject(MessageService)

  public isStudentsLoading = signal<boolean>(true)
  public students = signal<ShadowWarfareStudentPeriodState[]>([])

  public isExperienceSessionEndingLoading = signal<boolean>(false)

  public isAbilityUsesLoading = signal<boolean>(true)
  public abilityUses = signal<AbilityUseModel[]>([])

  public isCharactersLoading = signal<boolean>(true)
  public characters = signal<CharacterModel[]>([])

  public isTeamsLoading = signal<boolean>(true)
  public teams = signal<TeamModel[]>([])

  public readonly charactersMap = computed(
    () =>
      new Map(
        this.characters().map(character => [character.id, character.name])
      )
  )

  public readonly teamsMap = computed(
    () => new Map(this.teams().map(team => [team.id, team.name]))
  )

  public adminPanelOverviewLoading = output<boolean>({ alias: 'loading' })

  ngOnInit(): void {
    const classroomId = this.context.classroom()?.id ?? null
    const academicPeriodId = this.context.academicPeriod()?.id ?? null
    const experienceSession = this.context.experienceSession()

    if (
      classroomId === null ||
      academicPeriodId === null ||
      experienceSession === null
    )
      return

    this.loadAllTeams(classroomId)
    this.loadAllCharacters(classroomId)
    this.loadStudents({ classroomId, academicPeriodId })
    this.loadAbilityUses(experienceSession)
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
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

  public getCharacterName(characterId: string): string | null {
    return this.charactersMap().get(characterId) ?? null
  }

  public getTeamName(teamId: string): string | null {
    return this.teamsMap().get(teamId) ?? null
  }

  private loadAllTeams(classroomId: string) {
    this.teamService.getAllTeamsByClassroom(classroomId).subscribe({
      next: teams => {
        console.log(teams)
        this.teams.set(teams)
        this.isTeamsLoading.set(false)
      },
      error: err => {
        const error = err as ErrorResponse
        this.onShowTeamsLoadingErrorMessage(error.code)
      }
    })
  }

  private loadAllCharacters(classroomId: string) {
    this.characterService.getAllCharactersByClassroom(classroomId).subscribe({
      next: characters => {
        console.log(characters)
        this.characters.set(characters)
        this.isCharactersLoading.set(false)
      },
      error: err => {
        const error = err as ErrorResponse
        this.onShowCharactersLoadingErrorMessage(error.code)
      }
    })
  }

  private loadAbilityUses(experienceSession: ExperienceSessionModel) {
    this.abilityUseService
      .getAllAbilityUsesByExperienceAndExperienceSessionId({
        experience: experienceSession.experience,
        experienceSessionId: experienceSession.id
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: abilityUses => {
          console.log(abilityUses)
          this.abilityUses.set(abilityUses)
          this.isAbilityUsesLoading.set(false)
        },
        error: err => {
          const error = err as ErrorResponse
          this.onShowAbilityUsesLoadingErrorMessage(error.code)
        }
      })
  }

  private loadStudents({
    classroomId,
    academicPeriodId
  }: {
    classroomId: string
    academicPeriodId: string
  }) {
    this.studentPeriodStateService
      .getAllShadowWarfareStudentPeriodStates({ classroomId, academicPeriodId })
      .subscribe({
        next: students => {
          console.log(students)
          this.students.set(students)
          this.isStudentsLoading.set(false)
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

  private onShowCharactersLoadingErrorMessage(code: string) {
    const { summary, message } = charactersLoadingErrorMessages[code]
    this.toastService.add({ summary, detail: message })
  }

  private onShowTeamsLoadingErrorMessage(code: string) {
    const { summary, message } = teamsLoadingErrorMessages[code]
    this.toastService.add({ summary, detail: message })
  }
}
