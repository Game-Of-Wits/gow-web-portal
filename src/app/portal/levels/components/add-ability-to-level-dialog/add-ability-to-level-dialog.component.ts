import {
  Component,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  signal
} from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { LucideAngularModule, Plus, Sparkle, X } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { abilityTypeFormats } from '~/abilities/data/formats'
import { AbilityModel } from '~/abilities/models/Ability.model'
import { AbilityService } from '~/abilities/services/ability/ability.service'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { LevelService } from '~/levels/services/level/level.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { ErrorMessages } from '~/shared/types/ErrorMessages'

const abilitiesLoadingErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

const addAbilityToLevelErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

@Component({
  selector: 'gow-add-ability-to-level-dialog',
  templateUrl: './add-ability-to-level-dialog.component.html',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    LucideAngularModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService]
})
export class AddAbilityToLevelDialogComponent implements OnInit {
  public readonly addIcon = Plus
  public readonly closeIcon = X
  public readonly abilityIcon = Sparkle

  public readonly abilityTypeFormats = abilityTypeFormats

  private readonly levelService = inject(LevelService)
  private readonly abilityService = inject(AbilityService)

  private readonly context = inject(ClassroomAdminPanelContextService)
  private readonly toastService = inject(MessageService)

  public selectedAbilityControl = new FormControl<string>('', {
    validators: [Validators.required],
    nonNullable: true
  })

  public levelId = input.required<string | null>({ alias: 'levelId' })
  public showDialog = input.required<boolean>({ alias: 'show' })

  public abilities = signal<AbilityModel[]>([])
  public isAbilitiesLoading = signal<boolean>(true)

  public isAddAbilityToLevelLoading = signal<boolean>(false)

  public onClose = output<void>({ alias: 'close' })
  public onSuccess = output<{ levelId: string; abilityAdded: AbilityModel }>({
    alias: 'success'
  })

  ngOnInit(): void {
    this.loadAbilities()
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.onCloseDialog()
  }

  public async onSelectAbilityToLevel() {
    if (!this.selectedAbilityControl.invalid) return

    const abilityId = this.selectedAbilityControl.value
    const levelId = this.levelId()

    if (abilityId === '' || levelId === null) return

    this.isAddAbilityToLevelLoading.set(true)

    try {
      const ability = await this.levelService.addAbilityToLevelAsync(
        levelId,
        abilityId
      )
      this.onSuccess.emit({ levelId, abilityAdded: ability })
      this.onClose.emit()
    } catch (err) {
      const error = err as ErrorResponse
      this.onShowAddAbilityToLevelErrorMessage(error.code)
    } finally {
      this.isAddAbilityToLevelLoading.set(false)
    }
  }

  public onCloseDialog() {
    this.selectedAbilityControl.setValue('')
    this.onClose.emit()
  }

  public hasErrorValidation(validationKey: string) {
    return (
      this.selectedAbilityControl.hasError(validationKey) &&
      (this.selectedAbilityControl.dirty || this.selectedAbilityControl.touched)
    )
  }

  private loadAbilities() {
    const classroomId = this.context.classroom()?.id ?? null

    if (classroomId === null) return

    this.isAbilitiesLoading.set(true)

    this.abilityService
      .getAllAbilitiesByClassroomAndExperienceAsync(
        classroomId,
        EducationalExperience.MASTERY_ROAD
      )
      .then(abilities => {
        this.abilities.set(abilities)
        this.isAbilitiesLoading.set(false)
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.onShowAbilitiesLoadingErrorMessage(error.code)
      })
  }

  private onShowAbilitiesLoadingErrorMessage(code: string) {
    const { summary, message } = abilitiesLoadingErrorMessages[code]
    this.onShowErrorMessage(summary, message)
  }

  private onShowAddAbilityToLevelErrorMessage(code: string) {
    const { summary, message } = addAbilityToLevelErrorMessages[code]
    this.onShowErrorMessage(summary, message)
  }

  private onShowErrorMessage(summary: string, detail: string) {
    this.toastService.add({ severity: 'error', summary, detail })
  }
}
