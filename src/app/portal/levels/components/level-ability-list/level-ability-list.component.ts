import {
  Component,
  computed,
  Input,
  inject,
  input,
  OnInit,
  output,
  signal
} from '@angular/core'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { LucideAngularModule, Plus } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { AbilityModel } from '~/abilities/models/Ability.model'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { LevelService } from '~/levels/services/level/level.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import { LevelAbilityListItemComponent } from '../level-ability-list-item/level-ability-list-item.component'

const levelAbilitiesLoadingErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

@Component({
  selector: 'gow-level-abilities-list',
  templateUrl: './level-ability-list.component.html',
  imports: [
    LevelAbilityListItemComponent,
    ButtonModule,
    ProgressSpinnerModule,
    LucideAngularModule
  ],
  providers: [MessageService]
})
export class LevelAbilityListComponent implements OnInit {
  public readonly addIcon = Plus

  private readonly levelService = inject(LevelService)

  private readonly toastService = inject(MessageService)
  private readonly classroomContext = inject(ClassroomAdminPanelContextService)

  public levelId = input.required<string>({ alias: 'levelId' })
  @Input() levelAbilitiesMap!: Map<string, AbilityModel[]>

  public isLevelAbilitiesLoading = signal<boolean>(true)
  public isRemovingAbilityLoading = signal<boolean>(false)

  public onUpdateAbilities = output<AbilityModel[]>({
    alias: 'updateAbilities'
  })
  public onSelectLevelToAddAbility = output<void>({
    alias: 'selectLevelToAddAbility'
  })

  public hasActiveAcademicPeriod = computed(
    () => this.classroomContext.activeAcademicPeriod() !== null
  )

  public getLevelAbilities() {
    return this.levelAbilitiesMap.get(this.levelId()) ?? []
  }

  ngOnInit(): void {
    const abilities = this.levelAbilitiesMap.get(this.levelId())

    if (abilities !== undefined) {
      this.isLevelAbilitiesLoading.set(false)
      return
    }

    this.loadLevelAbilities()
  }

  public async onRemoveAbility(abilityId: string) {
    this.isRemovingAbilityLoading.set(true)

    try {
      await this.levelService.removeAbilityFromLevelAsync(
        this.levelId(),
        abilityId
      )

      this.levelAbilitiesMap.set(
        this.levelId(),
        this.getLevelAbilities().filter(ability => ability.id !== abilityId)
      )
      this.isRemovingAbilityLoading.set(false)
    } catch (err) {
      const error = err as ErrorResponse
      this.onShowRemovingAbilityErrorMessage(error.code)
    }
  }

  public onOpenAddAbilityToLevelForm() {
    this.onSelectLevelToAddAbility.emit()
  }

  private loadLevelAbilities() {
    this.isLevelAbilitiesLoading.set(true)

    this.levelService.getAllAbilitiesFromLevel(this.levelId()).subscribe({
      next: abilities => {
        this.levelAbilitiesMap.set(this.levelId(), abilities)
        this.isLevelAbilitiesLoading.set(false)
      },
      error: err => {
        const error = err as ErrorResponse
        this.onShowLevelAbilitiesLoadingErrorMessage(error.code)
      }
    })
  }

  private onShowLevelAbilitiesLoadingErrorMessage(code: string) {
    const { summary, message } = levelAbilitiesLoadingErrorMessages[code]
    this.onShowErrorMessage(summary, message)
  }

  private onShowRemovingAbilityErrorMessage(code: string) {
    const { summary, message } = levelAbilitiesLoadingErrorMessages[code]
    this.onShowErrorMessage(summary, message)
  }

  private onShowErrorMessage(summary: string, detail: string) {
    this.toastService.add({ severity: 'error', detail, summary })
  }
}
