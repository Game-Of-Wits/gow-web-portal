import { Component, inject, input, OnInit, signal } from '@angular/core'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { CardModule } from 'primeng/card'
import { SkeletonModule } from 'primeng/skeleton'
import { TagModule } from 'primeng/tag'
import { CharacterModel } from '~/characters/models/Character.model'
import { CharacterService } from '~/characters/services/character/character.service'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { HomeworkService } from '~/homeworks/services/homework/homework.service'
import { ShadowWarfareExperienceState } from '~/students/models/StudentPeriodStates.model'
import { TeamModel } from '~/teams/models/Team.model'
import { TeamService } from '~/teams/services/team/team.service'

@Component({
  selector: 'gow-shadow-warfare-card',
  imports: [CardModule, TagModule, SkeletonModule],
  template: `
    <p-card>
      <ng-template pTemplate="header">
        <div class="p-4 pb-0">
          <h2 class="text-xl font-semibold text-danger-500 m-0">
            Guerra de Sombras
          </h2>
        </div>
      </ng-template>

      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-500 mb-1">Personaje</p>
            <div class="flex items-center gap-2">
              <span class="text-red-500">👤</span>

              @if (!isLoading()) {
                @if (character(); as character) {
                  <span class="font-semibold">{{ character.name }}</span>
                }
              } @else {
                <p-skeleton width="w-[80px]" height="1rem" borderRadius="10px" />
              }
            </div>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Equipo</p>
            <div class="flex items-center gap-2">
              @if (!isLoading()) {
                @if (team(); as team) {
                  <span class="font-semibold">{{ team.name }}</span>
                }
              } @else {
                <p-skeleton width="w-[80px]" height="1rem" borderRadius="10px" />
              }
            </div>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Puntos de vida</p>
            <div class="flex items-center gap-2">
              <i class="pi pi-heart-fill text-red-500"></i>
              <span class="font-semibold">{{ shadowWarfareState().healthPoints }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-sm text-teal-600">Tareas completadas</span>
              </div>

              @if (!isLoading()) {
                <p-tag
                  value="{{ homeworkInfo().completed }}"
                  styleClass="bg-teal-100 text-teal-700 border-teal-200"
                />
              } @else {
                <p-skeleton width="20px" height="20px" borderRadius="10px" />
              }
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-sm text-green-600">Tareas aprobadas</span>
              </div>

              @if (!isLoading()) {
                <p-tag
                  value="{{ homeworkInfo().successful }}"
                  styleClass="bg-green-100 text-green-700 border-green-200"
                />
              } @else {
                <p-skeleton width="20px" height="20px" borderRadius="10px" />
              }
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-sm text-orange-600">Tareas no entregadas</span>
              </div>

              @if (!isLoading()) {
                <p-tag
                  value="{{ homeworkInfo().noCompleted == 0 ? 'Ninguno' : homeworkInfo().noCompleted }}"
                  styleClass="bg-orange-100 text-orange-700 border-orange-200"
                />
              } @else {
                <p-skeleton width="20px" height="20px" borderRadius="10px" />
              }
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-sm text-red-600">Tareas desaprobadas</span>
              </div>

              @if (!isLoading()) {
                <p-tag
                  value="{{ homeworkInfo().noSuccessful }}"
                  styleClass="bg-red-100 text-red-700 border-red-200"
                />
              } @else {
                <p-skeleton width="20px" height="20px" borderRadius="10px" />
              }
            </div>
          </div>
        </div>
      </div>
    </p-card>
  `
})
export class ShadowWarfareCardComponent implements OnInit {
  private readonly teamService = inject(TeamService)
  private readonly characterService = inject(CharacterService)
  private readonly homeworkService = inject(HomeworkService)

  private readonly context = inject(ClassroomAdminPanelContextService)

  public studentPeriodStateId = input.required<string>({
    alias: 'studentPeriodStateId'
  })
  public shadowWarfareState = input.required<ShadowWarfareExperienceState>({
    alias: 'state'
  })

  public character = signal<CharacterModel | null>(null)
  public team = signal<TeamModel | null>(null)
  public homeworkInfo = signal<{
    successful: number | null
    noSuccessful: number | null
    noCompleted: number | null
    completed: number | null
  }>({
    successful: null,
    noSuccessful: null,
    noCompleted: null,
    completed: null
  })

  public isLoading = signal<boolean>(true)

  ngOnInit(): void {
    Promise.all([
      this.loadTeam(),
      this.loadCharacter(),
      this.loadHomeworkInformation()
    ]).then(() => {
      this.isLoading.set(false)
    })
  }

  private async loadTeam() {
    const team = await this.teamService.getTeamById(
      this.shadowWarfareState().teamId
    )
    this.team.set(team)
  }

  private async loadCharacter() {
    const character = await this.characterService.getCharacterByIdAsync(
      this.shadowWarfareState().characterId
    )
    this.character.set(character)
  }

  private async loadHomeworkInformation() {
    const classroomId = this.context.classroom()?.id

    if (classroomId === undefined)
      throw new ErrorResponse('classroom-not-exist')

    const homeworkInfo =
      await this.homeworkService.getHomeworkInfoByStudentPeriodStateIdAndClassroomId(
        this.studentPeriodStateId(),
        classroomId
      )
    this.homeworkInfo.set(homeworkInfo)
  }
}
