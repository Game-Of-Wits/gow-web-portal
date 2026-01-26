import { Component, inject, input, OnInit, signal } from '@angular/core'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { Download, LucideAngularModule } from 'lucide-angular'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { SkeletonModule } from 'primeng/skeleton'
import { TagModule } from 'primeng/tag'
import { LevelModel } from '~/levels/models/Level.model'
import { LevelService } from '~/levels/services/level/level.service'
import { rankingStyles } from '~/students/data/rankingStyles'
import { MasteryRoadExperienceState } from '~/students/models/StudentPeriodStates.model'
import { StudentPeriodStateService } from '~/students/services/student-period-state/student-period-state.service'

@Component({
  selector: 'gow-mastery-road-card',
  imports: [
    CardModule,
    LucideAngularModule,
    ButtonModule,
    TagModule,
    SkeletonModule
  ],
  template: `
    <p-card>
      <ng-template pTemplate="header">
        <div class="flex justify-between items-center p-4 pb-0">
          <h2 class="text-2xl font-semibold text-info-600 m-0">
            Camino de la Maestría
          </h2>

          <button
            pButton
            outlined
            severity="info"
            size="small"
            class="rounded-lg"
            [loading]="isDownloadingReport() || isLevelLoading() || isRankingLoading()"
            (click)="onDownloadReport()"
            title="Descargar reporte de Excel"
          >
            <i-lucide
              pButtonIcon
              [img]="downloadIcon"
              class="fill-white size-5"
            />
            <span pButtonLabel class="hidden sm:inline-flex"
              >Reporte</span
            >
          </button>
        </div>
      </ng-template>

      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <p class="text-sm text-gray-500 mb-1">Ranking</p>
            <div class="flex items-center gap-x-1.5">
              <span class="text-[1.40rem]">{{ rankingStyles[currentRank()]?.textIcon ?? '🚀' }}</span>
              @if (!isRankingLoading()) {
                <p-tag
                  value="#{{ currentRank() }}"
                  styleClass="text-[1.1rem] {{
                    rankingStyles[currentRank()]?.styleClass ?? 'bg-transparent text-black'
                  }}"
                />
              } @else {
                <p-skeleton width="30px" height="30px" borderRadius="4px" />
              }
            </div>
          </div>

          <div>
            <p class="text-sm text-gray-500 mb-1">Nivel</p>
            <div class="flex items-center gap-2">
              <span>🏆</span>

              @if (!isLevelLoading()) {
                @if (currentLevel(); as currentLevel) {
                  <span class="font-semibold text-xl">{{ currentLevel.name }}</span>
                }
              } @else {
                <p-skeleton width="w-[80px]" height="1rem" borderRadius="10px" />
              }
            </div>
          </div>

          <div>
            <p class="text-sm text-gray-500 mb-1">Puntaje total</p>
            <div class="flex items-center gap-2">
              <span>✨</span>
              <span class="font-semibold text-2xl">{{ masteryRoadState().progressPoints }}</span>
            </div>
          </div>

          <div>
            <p class="text-sm text-gray-500 mb-1">Nota academica</p>
            <div class="flex items-center gap-2">
              <span>🌟</span>
              @if (!isRankingLoading()) {
                <span class="font-semibold text-2xl">{{ currentVigesimalScore().toString() }}</span>
              } @else {
                <p-skeleton width="30px" height="30px" borderRadius="4px" />
              }
            </div>
          </div>
        </div>
      </div>
    </p-card>
  `
})
export class MasteryRoadCardComponent implements OnInit {
  public readonly downloadIcon = Download

  private readonly levelService = inject(LevelService)
  private readonly studentPeriodStateService = inject(StudentPeriodStateService)

  public readonly rankingStyles: {
    [rank: number]: { styleClass: string | null; textIcon: string | null }
  } = rankingStyles

  public studentPeriodStateId = input.required<string>({
    alias: 'studentPeriodStateId'
  })
  public classroomId = input.required<string>({
    alias: 'classroomId'
  })
  public academicPeriodId = input.required<string>({
    alias: 'academicPeriodId'
  })
  public masteryRoadState = input.required<MasteryRoadExperienceState>({
    alias: 'state'
  })

  public currentLevel = signal<LevelModel | null>(null)
  public currentRank = signal<number>(0)
  public currentVigesimalScore = signal<number>(0)

  public isLevelLoading = signal<boolean>(true)
  public isRankingLoading = signal<boolean>(true)
  public isDownloadingReport = signal<boolean>(false)

  ngOnInit(): void {
    this.loadStudentLevel()
    this.loadStudentRanking()
  }

  public async onDownloadReport() {
    this.isDownloadingReport.set(true)

    try {
      const { downloadReportUrl } =
        await this.studentPeriodStateService.downloadReportOfMasteryRoadStudentPeriodStates(
          {
            classroomId: this.classroomId(),
            academicPeriodId: this.academicPeriodId()
          }
        )

      window.open(downloadReportUrl, '_blank')
    } catch (err) {
      const error = err as ErrorResponse
    } finally {
      this.isDownloadingReport.set(false)
    }
  }

  private loadStudentLevel() {
    this.levelService
      .getLevelByIdAsync(this.masteryRoadState().currentLevelId)
      .then(level => {
        this.currentLevel.set(level)
        this.isLevelLoading.set(false)
      })
      .catch(() => {})
  }

  private loadStudentRanking() {
    this.studentPeriodStateService
      .getMasteryRoadStudentPeriodStateRankingById(this.studentPeriodStateId())
      .then(studentRanking => {
        if (studentRanking === null) {
          this.isRankingLoading.set(false)
          return
        }

        this.currentRank.set(studentRanking.rank)
        this.currentVigesimalScore.set(studentRanking.vigesimalScore)
        this.isRankingLoading.set(false)
      })
      .catch(() => {})
  }
}
