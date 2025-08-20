import { Component, inject, input, OnInit, signal } from '@angular/core'
import { CardModule } from 'primeng/card'
import { SkeletonModule } from 'primeng/skeleton'
import { LevelModel } from '~/levels/models/Level.model'
import { LevelService } from '~/levels/services/level/level.service'
import { MasteryRoadExperienceState } from '~/students/models/StudentPeriodStates.model'

@Component({
  selector: 'gow-mastery-road-card',
  imports: [CardModule, SkeletonModule],
  template: `
    <p-card>
      <ng-template pTemplate="header">
        <div class="p-4 pb-0">
          <h2 class="text-xl font-semibold text-info-600 m-0">
            Camino de la Maestría
          </h2>
        </div>
      </ng-template>

      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-500 mb-1">Nivel</p>
            <div class="flex items-center gap-2">
              <span class="text-info-600">🏆</span>

              @if (!isLoading()) {
                @if (currentLevel(); as currentLevel) {
                  <span class="font-semibold">{{ currentLevel.name }}</span>
                }
              } @else {
                <p-skeleton width="w-[80px]" height="1rem" borderRadius="10px" />
              }
            </div>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Puntaje</p>
            <div class="flex items-center gap-2">
              <span class="text-teal-400">✨</span>
              <span class="font-semibold text-2xl">{{ masteryRoadState().progressPoints }}</span>
            </div>
          </div>
        </div>
      </div>
    </p-card>
  `
})
export class MasteryRoadCardComponent implements OnInit {
  private readonly levelService = inject(LevelService)

  public studentPeriodStateId = input.required<string>({
    alias: 'studentPeriodStateId'
  })
  public masteryRoadState = input.required<MasteryRoadExperienceState>({
    alias: 'state'
  })

  public currentLevel = signal<LevelModel | null>(null)

  public isLoading = signal<boolean>(true)

  ngOnInit(): void {
    this.levelService
      .getLevelByIdAsync(this.masteryRoadState().currentLevelId)
      .then(level => {
        this.currentLevel.set(level)
        this.isLoading.set(false)
      })
      .catch(() => {})
  }
}
