import { Component, computed, inject, OnInit, signal } from '@angular/core'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { LucideAngularModule, Pencil, Plus, Trash2 } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { TableModule } from 'primeng/table'
import { Toast } from 'primeng/toast'
import { CharacterModel } from '~/characters/models/Character.model'
import { CharacterService } from '~/characters/services/character/character.service'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { SectionTitleComponent } from '~/shared/components/ui/section-title/section-title.component'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import { TeamModel } from '~/teams/models/Team.model'
import { TeamService } from '~/teams/services/team/team.service'

const errorMessages: ErrorMessages = {
  ...commonErrorMessages
}

@Component({
  selector: 'gow-classroom-admin-panel-teams-characters',
  templateUrl: './classroom-admin-panel-teams-characters.component.html',
  imports: [
    TableModule,
    ProgressSpinnerModule,
    ButtonModule,
    Toast,
    SectionTitleComponent,
    ProgressSpinnerModule,
    LucideAngularModule
  ],
  providers: [MessageService]
})
export class ClassroomAdminPanelTeamsCharactersPageComponent implements OnInit {
  public readonly addIcon = Plus
  public readonly deleteIcon = Trash2
  public readonly editIcon = Pencil

  private readonly characterService = inject(CharacterService)
  private readonly teamService = inject(TeamService)

  private readonly context = inject(ClassroomAdminPanelContextService)
  private readonly toastService = inject(MessageService)

  public isCharactersLoading = signal<boolean>(false)
  public characters = signal<CharacterModel[]>([])

  public isTeamsLoading = signal<boolean>(false)
  public teams = signal<TeamModel[]>([])

  public readonly teamsMap = computed(
    () => new Map(this.teams().map(team => [team.id, team.name]))
  )

  ngOnInit(): void {
    const classroomId = this.context.classroom()?.id ?? null

    if (classroomId === null) return

    this.loadAllTeams(classroomId)
    this.loadAllCharacters(classroomId)
  }

  public getTeamName(teamId: string): string | null {
    return this.teamsMap().get(teamId) ?? null
  }

  private loadAllTeams(classroomId: string) {
    this.isTeamsLoading.set(true)

    this.teamService.getAllTeamsByClassroom(classroomId).subscribe({
      next: teams => {
        this.teams.set(teams)
        this.isTeamsLoading.set(false)
      },
      error: err => {
        const error = err as ErrorResponse
        this.onShowErrorMessage(error.code)
      }
    })
  }

  private loadAllCharacters(classroomId: string) {
    this.isCharactersLoading.set(true)

    this.characterService.getAllCharactersByClassroom(classroomId).subscribe({
      next: characters => {
        this.characters.set(characters)
        this.isCharactersLoading.set(false)
      },
      error: err => {
        const error = err as ErrorResponse
        this.onShowErrorMessage(error.code)
      }
    })
  }

  private onShowErrorMessage(code: string) {
    const { summary, message } = errorMessages[code]
    this.toastService.add({ summary, detail: message })
  }
}
