import {
  Component,
  HostListener,
  Input,
  input,
  OnChanges,
  OnInit,
  output,
  SimpleChanges
} from '@angular/core'
import {
  AbstractControl,
  FormArray,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { Info, LucideAngularModule, X } from 'lucide-angular'
import { DialogModule } from 'primeng/dialog'
import { MessageModule } from 'primeng/message'
import { abilityActionTypeOptions } from '~/abilities/data/options'
import {
  ascensionActionForm,
  classroomActionForm,
  deferealHomeworkActionForm,
  healthActionForm,
  revealActionForm,
  reviveActionForm,
  theftActionForm
} from '~/abilities/forms'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AbilityActionForm } from '~/abilities/models/AbilityForm.model'
import {
  isAscensionActionForm,
  isClassroomActionForm,
  isDeferralHomeworkActionForm,
  isHealthActionForm,
  isRevealActionForm,
  isReviveActionForm,
  isTheftActionForm
} from '~/abilities/utils/abilityActionFormValidator'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { AscensionActionFormComponent } from './components/ascension-action-form/ascension-action-form.component'
import { DeferealHomeworkActionFormComponent } from './components/defereal-homework-action-form/defereal-homework-action-form.component'
import { HealthActionFormComponent } from './components/health-action-form/health-action-form.component'
import { RevealActionFormComponent } from './components/reveal-action-form/reveal-action-form.component'
import { ReviveActionFormComponent } from './components/revive-action-form/revive-action-form.component'
import { TheftActionFormComponent } from './components/theft-action-form/theft-action-form.component'

export type AbilityActionColorSchema = 'primary' | 'info' | 'danger'

const dialogColorScheme: Record<string, { buttonColorClass: string }> = {
  primary: {
    buttonColorClass:
      'hover:bg-primary-600 bg-primary-500 disabled:bg-primary-100'
  },
  info: {
    buttonColorClass: 'hover:bg-info-600 bg-info-500 disabled:bg-info-100'
  },
  danger: {
    buttonColorClass: 'hover:bg-danger-600 bg-danger-500 disabled:bg-danger-100'
  }
}

const abilityActionFormMap: Record<AbilityActionType, Function> = {
  [AbilityActionType.DEFEREAL_HOMEWORK]: deferealHomeworkActionForm,
  [AbilityActionType.HEALTH]: healthActionForm,
  [AbilityActionType.ASCENSION]: ascensionActionForm,
  [AbilityActionType.CLASSROOM]: classroomActionForm,
  [AbilityActionType.REVIVE]: reviveActionForm,
  [AbilityActionType.REVEAL]: revealActionForm,
  [AbilityActionType.THEFT]: theftActionForm
}

@Component({
  selector: 'gow-ability-action-form-dialog',
  templateUrl: './ability-action-form-dialog.component.html',
  imports: [
    DialogModule,
    MessageModule,
    ReactiveFormsModule,
    SelectFieldComponent,
    RevealActionFormComponent,
    AscensionActionFormComponent,
    ReviveActionFormComponent,
    HealthActionFormComponent,
    TheftActionFormComponent,
    DeferealHomeworkActionFormComponent,
    LucideAngularModule
  ]
})
export class AbilityActionFormDialogComponent implements OnInit, OnChanges {
  public readonly closeIcon = X
  public readonly infoIcon = Info
  public readonly dialogColorScheme = dialogColorScheme
  public readonly classroomAbilityActionType = AbilityActionType.CLASSROOM

  public isAscensionActionForm = isAscensionActionForm
  public isTheftActionForm = isTheftActionForm
  public isHealthActionForm = isHealthActionForm
  public isRevealActionForm = isRevealActionForm
  public isReviveActionForm = isReviveActionForm
  public isDeferralHomeworkActionForm = isDeferralHomeworkActionForm
  public isClassroomActionForm = isClassroomActionForm

  @Input() abilityActionForm!: AbilityActionForm | null
  @Input() abilityActionListForm!: FormArray<AbilityActionForm>

  public showDialog = input.required<boolean>({ alias: 'show' })
  public headerTitle = input.required<string>({ alias: 'headerTitle' })
  public buttonText = input.required<string>({ alias: 'buttonText' })

  public abilityActionPosition = input<number>(0, { alias: 'position' })
  public colorScheme = input<AbilityActionColorSchema>('primary', {
    alias: 'colorScheme'
  })

  public onClose = output<void>({ alias: 'close' })
  public onSuccess = output<{
    position: number
    form: AbilityActionForm
  }>({ alias: 'success' })

  public abilityActionTypeControl = new FormControl<AbilityActionType | null>(
    null,
    { validators: [Validators.required] }
  )

  ngOnInit(): void {
    if (this.abilityActionForm !== null) {
      const abilityActionTypeControl = this.abilityActionTypeControl

      abilityActionTypeControl.valueChanges.subscribe(value => {
        const defaultAbilityActionForm =
          value !== null
            ? value !== AbilityActionType.CLASSROOM
              ? abilityActionFormMap[value](
                  this.abilityActionForm?.getRawValue()
                )
              : abilityActionFormMap[value]()
            : null

        this.abilityActionForm = defaultAbilityActionForm
      })
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['abilityActionForm']) {
      const current = changes['abilityActionForm']
        .currentValue as AbilityActionForm | null

      this.abilityActionTypeControl.setValue(
        current?.getRawValue().type ?? null
      )
    }
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.onCloseDialog()
  }

  public onCloseDialog() {
    this.onClose.emit()
    this.abilityActionTypeControl.reset(null)
    this.abilityActionForm = null
  }

  public hasErrorValidation(
    control: AbstractControl | null,
    validationKey: string
  ) {
    return control?.pristine || control?.hasError(validationKey)
  }

  public onSubmitAbilityAction() {
    const abilityActionForm = this.abilityActionForm

    if (abilityActionForm?.invalid || abilityActionForm == null) return

    this.onSuccess.emit({
      position: this.abilityActionPosition(),
      form: abilityActionForm
    })
    this.onCloseDialog()
  }

  public abilityActionsUsed() {
    return this.abilityActionListForm
      .getRawValue()
      .map(abilityAction => abilityAction.type)
  }

  public availableActionOptions() {
    return abilityActionTypeOptions.filter(
      option =>
        !this.abilityActionsUsed().includes(option.code as AbilityActionType)
    )
  }
}
