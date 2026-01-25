import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray
} from '@angular/cdk/drag-drop'
import {
  Component,
  computed,
  HostListener,
  Input,
  inject,
  input,
  OnInit,
  output,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core'
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import {
  GripVertical,
  LucideAngularModule,
  LucideIconData,
  Sparkle,
  Trash2,
  X
} from 'lucide-angular'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { abilityTypeFormats } from '~/abilities/data/formats'
import { AbilityModel } from '~/abilities/models/Ability.model'
import { AbilityService } from '~/abilities/services/ability/ability.service'
import { fullCharacterForm } from '~/characters/forms/fullCharacterForm'
import { FullCharacterForm } from '~/characters/models/FullCharacterForm.model'
import { FullCharacterFormData } from '~/characters/models/FullCharacterFormData.model'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { TextFieldComponent } from '~/shared/components/ui/text-field/text-field.component'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { SelectOption } from '~/shared/types/SelectOption'
import { TeamModel } from '~/teams/models/Team.model'
import { CharacterSelectAbilitiesdDialogComponent } from './components/character-select-abilities-dialog.component'

export type FullCharacterFormSubmit = {
  result: {
    id: string | null
    formData: FullCharacterFormData
  }
  onFinish: () => void
}

@Component({
  selector: 'gow-full-character-form-dialog',
  templateUrl: './full-character-form-dialog.component.html',
  imports: [
    ButtonModule,
    DialogModule,
    DragDropModule,
    ReactiveFormsModule,
    TextFieldComponent,
    SelectFieldComponent,
    CharacterSelectAbilitiesdDialogComponent,
    LucideAngularModule
  ]
})
export class FullCharacterFormDialogComponent implements OnInit, OnChanges {
  public readonly closeIcon = X
  public readonly grabIcon = GripVertical
  public readonly abilityIcon = Sparkle
  public readonly removeIcon = Trash2

  public readonly abilityTypeFormats = abilityTypeFormats

  private readonly abilityService = inject(AbilityService)

  private readonly classroomContext = inject(ClassroomAdminPanelContextService)

  @Input() fullCharacterForm: FormGroup<FullCharacterForm> | null = null
  @Input() id: string | null = null

  public showDialog = input.required<boolean>({ alias: 'show' })
  public headerTitle = input.required<string>({ alias: 'headerTitle' })
  public buttonText = input.required<string>({ alias: 'buttonText' })
  public buttonIcon = input.required<LucideIconData>({ alias: 'buttonIcon' })
  public teams = input.required<TeamModel[]>({ alias: 'teams' })

  public isSubmitLoading = signal<boolean>(false)

  public showSelectAbilities = signal<boolean>(false)

  public abilities = signal<AbilityModel[]>([])
  public selectedAbilities = signal<string[]>([])
  public isAbilitiesLoading = signal<boolean>(true)

  public onClose = output<void>({ alias: 'close' })
  public onSubmit = output<FullCharacterFormSubmit>({
    alias: 'submit'
  })

  public teamOptions = computed<SelectOption[]>(() => {
    return this.teams().map(team => ({ name: team.name, code: team.id }))
  })

  public abilitiesMap = computed<Map<string, AbilityModel>>(
    () => new Map(this.abilities().map(ability => [ability.id, ability]))
  )

  public classroomLimitAbilities = computed(() => {
    return this.classroomContext.classroom()?.experiences[
      EducationalExperience.SHADOW_WARFARE
    ].limitAbilities
  })

  public hasActiveAcademicPeriod = computed(
    () => this.classroomContext.activeAcademicPeriod() !== null
  )

  ngOnInit(): void {
    const limitAbilities = this.classroomLimitAbilities()

    if (limitAbilities === undefined) return

    if (this.fullCharacterForm === null)
      this.fullCharacterForm = fullCharacterForm(limitAbilities)

    this.selectedAbilities.set(this.fullCharacterForm.getRawValue().abilities)

    this.loadAbilities()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fullCharacterForm']) {
      const form = changes['fullCharacterForm'].currentValue as FormGroup<FullCharacterForm> | null

      if (form === null) return

      this.selectedAbilities.set(form.getRawValue().abilities)
      this.abilitiesControl.setValue(form.getRawValue().abilities)
    }
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.onCloseDialog()
  }

  public hasErrorValidation(
    control: AbstractControl | null,
    validationKey: string
  ) {
    if (control === null) return false
    return control?.pristine || control?.hasError(validationKey)
  }

  public onSubmitCharacterForm() {
    const characterForm = this.fullCharacterForm
    const characterId = this.id

    if (!characterForm || characterForm.invalid) return

    this.isSubmitLoading.set(true)

    this.onSubmit.emit({
      result: {
        id: characterId,
        formData: characterForm.getRawValue()
      },
      onFinish: () => {
        this.onCloseDialog()
      }
    })
  }

  public onCloseDialog() {
    const limitAbilities = this.classroomLimitAbilities()
    if (limitAbilities === undefined) return

    this.onClose.emit()
    this.isSubmitLoading.set(false)

    this.fullCharacterForm = fullCharacterForm(limitAbilities)
  }

  public onOpenSelectAbilities() {
    this.showSelectAbilities.set(true)
    this.selectedAbilities.set(
      this.fullCharacterForm?.getRawValue().abilities ?? []
    )
  }

  public onCloseSelectAbilities() {
    this.showSelectAbilities.set(false)
  }

  public onUpdateAbilitiesSelected(abilityIds: string[]) {
    this.abilitiesControl.setValue(abilityIds)
    this.selectedAbilities.set(abilityIds)
  }

  public onRemoveAbility(position: number) {
    const newAbilities = this.abilitiesControl.value.filter(
      (_, index) => index !== position
    )
    this.abilitiesControl.setValue(newAbilities)
    this.selectedAbilities.set(newAbilities)
    this.abilitiesControl.markAsDirty()
  }

  public onDropAbility(event: CdkDragDrop<string[]>) {
    const currentAbilities = [...this.abilitiesControl.value]

    moveItemInArray(currentAbilities, event.previousIndex, event.currentIndex)

    this.abilitiesControl.setValue(currentAbilities)
    this.selectedAbilities.set(currentAbilities)

    this.abilitiesControl.markAsDirty()
    this.abilitiesControl.updateValueAndValidity()
  }

  private loadAbilities() {
    const classroomId = this.classroomContext.classroom()?.id

    if (classroomId === undefined) return

    this.isAbilitiesLoading.set(true)

    this.abilityService
      .getAllAbilitiesByClassroomAndExperienceAsync(
        classroomId,
        EducationalExperience.SHADOW_WARFARE
      )
      .then(abilities => {
        this.abilities.set(abilities)
        this.isAbilitiesLoading.set(false)
      })
      .catch(err => {
      })
  }

  get characterNameControl(): AbstractControl<string> {
    return this.fullCharacterForm?.get('name') as AbstractControl<string>
  }

  get teamControl(): AbstractControl<string> {
    return this.fullCharacterForm?.get('team') as AbstractControl<string>
  }

  get abilitiesControl(): AbstractControl<string[]> {
    return this.fullCharacterForm?.get('abilities') as AbstractControl<string[]>
  }
}
