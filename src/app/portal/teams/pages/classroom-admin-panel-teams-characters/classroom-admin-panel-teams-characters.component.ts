import { Component, computed, inject, OnInit, signal } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { LucideAngularModule, Pencil, Plus, Save, Trash2 } from 'lucide-angular'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { TableModule } from 'primeng/table'
import { Toast } from 'primeng/toast'
import {
  FullCharacterFormDialogComponent,
  FullCharacterFormSubmit
} from '~/characters/components/full-character-form-dialog/full-character-form-dialog.component'
import { fullCharacterForm } from '~/characters/forms/fullCharacterForm'
import { CharacterModel } from '~/characters/models/Character.model'
import { FullCharacterForm } from '~/characters/models/FullCharacterForm.model'
import { CharacterService } from '~/characters/services/character/character.service'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { SectionTitleComponent } from '~/shared/components/ui/section-title/section-title.component'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import {
  TeamFormDialogComponent,
  TeamFormSubmit
} from '~/teams/components/team-form-dialog/team-form-dialog.component'
import { teamForm } from '~/teams/forms/teamForm'
import { TeamModel } from '~/teams/models/Team.model'
import { TeamForm } from '~/teams/models/TeamForm.model'
import { TeamService } from '~/teams/services/team/team.service'

const createCharacterErrorMessages: ErrorMessages = {
  'classroom-not-exist': {
    summary: 'Aula no encontrada',
    message: 'No se ha encontrado el aula de clase'
  },
  'team-not-exist': {
    summary: 'Equipo no encontrado',
    message: 'No se ha encontrado el equipo'
  },
  'not-all-abilities-exist': {
    summary: 'Habilidades no encontradas',
    message: 'De las habilidades seleccionadas, no todas se ha podido encontrar'
  },
  ...commonErrorMessages
}

const editCharacterErrorMessages: ErrorMessages = {
  'character-not-exist': {
    summary: 'Personaje no encontrado',
    message: 'No se ha encontrado el personaje'
  },
  'classroom-not-exist': {
    summary: 'Aula no encontrada',
    message: 'No se ha encontrado el aula de clase'
  },
  'team-not-exist': {
    summary: 'Equipo no encontrado',
    message: 'No se ha encontrado el equipo'
  },
  'not-all-abilities-exist': {
    summary: 'Habilidades no encontradas',
    message: 'De las habilidades seleccionadas, no todas se ha podido encontrar'
  },
  ...commonErrorMessages
}

const deleteCharacterErrorMessages: ErrorMessages = {
  'character-not-exist': {
    summary: 'Personaje no encontrado',
    message: 'No se ha encontrado el personaje'
  },
  'classroom-not-exist': {
    summary: 'Aula no encontrada',
    message: 'No se ha encontrado el aula de clase'
  },
  'delete-character-': {
    summary: 'Habilidades no encontradas',
    message: 'De las habilidades seleccionadas, no todas se ha podido encontrar'
  },
  ...commonErrorMessages
}

const createTeamErrorMessages: ErrorMessages = {
  'classroom-not-exist': {
    summary: 'Aula no encontrada',
    message: 'No se ha encontrado el aula de clase'
  },
  ...commonErrorMessages
}

const editTeamErrorMessages: ErrorMessages = {
  'team-not-exist': {
    summary: 'Equipo no encontrado',
    message: 'No se ha encontrado el equipo'
  },
  'classroom-not-exist': {
    summary: 'Aula no encontrada',
    message: 'No se ha encontrado el aula de clase'
  },
  ...commonErrorMessages
}

const deleteTeamErrorMessages: ErrorMessages = {
  'school-not-found': {
    summary: 'Escuela no encontrado',
    message: 'No se ha encontrado la escuela'
  },
  'delete-team-not-allowed-by-active-period': {
    summary: 'Eliminación de equipo no permitida',
    message:
      'No se puede eliminar un equipo cuando el existe un periodo academico activo'
  },
  'delete-team-not-allowed-by-limit': {
    summary: 'Eliminación de equipo no permitida',
    message:
      'No se puede eliminar un equipo debido a que es requerido tener mínimo 2 en la clase'
  },
  ...commonErrorMessages
}

const charactersLoadingErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

const teamsLoadingErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

/*
 * TENER QUE SEPARAR ESTE PANEL EN COMPONENTES!!! URGENTE!!!
 */
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
    TeamFormDialogComponent,
    ConfirmDialogModule,
    FullCharacterFormDialogComponent,
    LucideAngularModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class ClassroomAdminPanelTeamsCharactersPageComponent implements OnInit {
  public readonly addIcon = Plus
  public readonly deleteIcon = Trash2
  public readonly editIcon = Pencil
  public readonly saveIcon = Save

  private readonly characterService = inject(CharacterService)
  private readonly teamService = inject(TeamService)

  private readonly classroomContext = inject(ClassroomAdminPanelContextService)
  private readonly toastService = inject(MessageService)
  private readonly confirmationService = inject(ConfirmationService)

  public isCharactersLoading = signal<boolean>(false)
  public characters = signal<CharacterModel[]>([])

  public isTeamsLoading = signal<boolean>(false)
  public teams = signal<TeamModel[]>([])

  public showCreateTeamFormDialog = signal<boolean>(false)
  public showEditTeamFormDialog = signal<boolean>(false)

  public editTeamSelected = signal<{
    id: string | null
    form: FormGroup<TeamForm> | null
  }>({
    id: null,
    form: null
  })

  public deletingTeamLoading = signal<boolean>(false)

  public showCreateCharacterFormDialog = signal<boolean>(false)
  public showEditCharacterFormDialog = signal<boolean>(false)

  public editCharacterSelected = signal<{
    id: string | null
    form: FormGroup<FullCharacterForm> | null
  }>({
    id: null,
    form: null
  })

  public deletingCharacterLoading = signal<boolean>(false)

  public teamsMap = computed(
    () => new Map(this.teams().map(team => [team.id, team.name]))
  )

  public hasActiveAcademicPeriod = computed(
    () => this.classroomContext.activeAcademicPeriod() !== null
  )

  public disableActions = computed(
    () =>
      this.deletingTeamLoading() ||
      this.deletingCharacterLoading() ||
      this.hasActiveAcademicPeriod()
  )

  ngOnInit(): void {
    const classroomId = this.classroomContext.classroom()?.id ?? null

    if (classroomId === null) return

    this.loadAllTeams(classroomId)
    this.loadAllCharacters(classroomId)
  }

  public getTeamName(teamId: string): string | null {
    return this.teamsMap().get(teamId) ?? null
  }

  public onOpenCreateTeamFormDialog() {
    this.showCreateTeamFormDialog.set(true)
    this.editTeamSelected.set({
      id: null,
      form: null
    })
  }

  public onOpenEditTeamFormDialog(team: TeamModel) {
    this.showEditTeamFormDialog.set(true)
    this.editTeamSelected.set({
      id: team.id,
      form: teamForm({ name: team.name })
    })
  }

  public onCloseTeamFormDialog() {
    this.showCreateTeamFormDialog.set(false)
    this.showEditTeamFormDialog.set(false)
    this.editTeamSelected.set({
      id: null,
      form: null
    })
  }

  public onCreateTeam(submit: TeamFormSubmit) {
    const classroomId = this.classroomContext.classroom()?.id ?? null

    if (classroomId === null) return

    this.teamService
      .createTeam({ name: submit.result.formData.name, classroomId })
      .then(team => {
        this.teams.update(teams => [...teams, team])
        submit.onFinish()
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showCreateTeamErrorMessage(error.code)
      })
  }

  public onEditTeam(submit: TeamFormSubmit) {
    const teamId = submit.result.id

    if (teamId === null) return

    const updateData = submit.result.formData

    this.teamService
      .updateTeamById(teamId, updateData)
      .then(() => {
        this.teams.update(teams => {
          const teamIndex = teams.findIndex(team => team.id === teamId)
          if (teamIndex === -1) return teams

          const team = teams[teamIndex]
          teams[teamIndex] = {
            id: teamId,
            name: updateData.name,
            classroomId: team.classroomId,
            characterIds: team.characterIds
          }

          return teams
        })
        submit.onFinish()
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showEditTeamErrorMessage(error.code)
      })
  }

  public onOpenDeleteTeamConfirmation(teamId: string, event: Event) {
    const classroomId = this.classroomContext.classroom()?.id ?? null

    if (classroomId === null) return

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        '¿Estas seguro de eliminar el equipo? Esto eliminar los personajes que pertenezcan al equipo',
      header: 'Eliminar equipo',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
        loading: this.deletingTeamLoading()
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
        loading: this.deletingTeamLoading()
      },
      accept: async () => {
        this.deletingTeamLoading.set(true)

        try {
          await this.teamService.deleteTeamById(teamId, classroomId)

          this.teams.update(teams => teams.filter(team => team.id !== teamId))
          this.characters.update(characters =>
            characters.filter(character => character.teamId !== teamId)
          )
        } catch (err) {
          const error = err as ErrorResponse
          this.showDeleteTeamErrorMessage(error.code)
        } finally {
          this.deletingTeamLoading.set(false)
        }
      }
    })
  }

  public onOpenCreateCharacterFormDialog() {
    const limitAbilities =
      this.classroomContext.classroom()?.experiences[
        EducationalExperience.SHADOW_WARFARE
      ].limitAbilities

    if (limitAbilities === undefined) return

    this.showCreateCharacterFormDialog.set(true)
    this.editCharacterSelected.set({
      id: null,
      form: fullCharacterForm(limitAbilities)
    })
  }

  public onOpenEditCharacterFormDialog(character: CharacterModel) {
    const limitAbilities =
      this.classroomContext.classroom()?.experiences[
        EducationalExperience.SHADOW_WARFARE
      ].limitAbilities

    if (limitAbilities === undefined) return

    this.showEditCharacterFormDialog.set(true)
    this.editCharacterSelected.set({
      id: character.id,
      form: fullCharacterForm(limitAbilities, {
        name: character.name,
        abilities: character.abilityIds,
        team: character.teamId
      })
    })
  }

  public onCloseCharacterFormDialog() {
    this.showCreateCharacterFormDialog.set(false)
    this.showEditCharacterFormDialog.set(false)
    this.editCharacterSelected.set({
      id: null,
      form: null
    })
  }

  public onCreateCharacter(submit: FullCharacterFormSubmit) {
    const classroomId = this.classroomContext.classroom()?.id

    if (classroomId === undefined) return

    const createData = submit.result.formData

    this.characterService
      .createCharacter({
        teamId: createData.team,
        abilityIds: createData.abilities,
        name: createData.name.trim(),
        classroomId
      })
      .then(newCharacter => {
        this.characters.update(characters => [...characters, newCharacter])
        submit.onFinish()
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showCreateCharacterErrorMessage(error.code)
      })
  }

  public onEditCharacter(submit: FullCharacterFormSubmit) {
    const classroomId = this.classroomContext.classroom()?.id
    const characterId = submit.result.id

    if (classroomId === undefined || characterId === null) return

    const updateData = submit.result.formData

    this.characterService
      .updateCharacterById(characterId, {
        name: updateData.name.trim(),
        abilityIds: updateData.abilities,
        teamId: updateData.team
      })
      .then(() => {
        this.characters.update(characters => {
          const characterIndex = characters.findIndex(
            character => character.id === characterId
          )
          if (characterIndex === -1) return characters

          const character = characters[characterIndex]
          characters[characterIndex] = {
            id: character.id,
            name: updateData.name.trim(),
            classroomId: character.classroomId,
            abilityIds: updateData.abilities,
            teamId: updateData.team
          }

          return characters
        })
        submit.onFinish()
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showEditCharacterErrorMessage(error.code)
      })
  }

  public onOpenDeleteCharacterConfirmation(characterId: string, event: Event) {
    const classroomId = this.classroomContext.classroom()?.id ?? null

    if (classroomId === null) return

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estas seguro de eliminar el personaje?',
      header: 'Eliminar personaje',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
        loading: this.deletingCharacterLoading()
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
        loading: this.deletingCharacterLoading()
      },
      accept: async () => {
        this.deletingCharacterLoading.set(true)

        try {
          await this.characterService.deleteCharacterById(
            characterId,
            classroomId
          )
          this.characters.update(characters =>
            characters.filter(character => character.id !== characterId)
          )
        } catch (err) {
          const error = err as ErrorResponse
          this.showDeleteCharacterErrorMessage(error.code)
        } finally {
          this.deletingCharacterLoading.set(false)
        }
      }
    })
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
        this.showTeamsLoadingErrorMessage(error.code)
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
        this.showCharactersLoadingErrorMessage(error.code)
      }
    })
  }

  private showCreateCharacterErrorMessage(code: string) {
    const { summary, message } = createCharacterErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showDeleteCharacterErrorMessage(code: string) {
    const { summary, message } = deleteCharacterErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showEditCharacterErrorMessage(code: string) {
    const { summary, message } = editCharacterErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showCreateTeamErrorMessage(code: string) {
    const { summary, message } = createTeamErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showDeleteTeamErrorMessage(code: string) {
    const { summary, message } = deleteTeamErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showEditTeamErrorMessage(code: string) {
    const { summary, message } = editTeamErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showCharactersLoadingErrorMessage(code: string) {
    const { summary, message } = charactersLoadingErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showTeamsLoadingErrorMessage(code: string) {
    const { summary, message } = teamsLoadingErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showErrorMessage(summary: string, detail: string) {
    this.toastService.add({ severity: 'error', summary, detail })
  }
}
