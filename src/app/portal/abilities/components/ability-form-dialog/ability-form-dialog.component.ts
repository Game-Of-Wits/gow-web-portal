import {
  Component,
  HostListener,
  Input,
  input,
  output,
  SimpleChanges,
  signal
} from '@angular/core'
import {
  AbstractControl,
  FormArray,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms'
import { LucideAngularModule, LucideIconData, X } from 'lucide-angular'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { ToggleSwitchModule } from 'primeng/toggleswitch'
import {
  abilityClassShiftOptions,
  abilityTypeOptions,
  abilityUsageOptions
} from '~/abilities/data/options'
import { fullAbilityForm } from '~/abilities/forms/fullAbilityForm'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AbilityClassShift } from '~/abilities/models/AbilityClassShift.model'
import {
  AbilityActionForm,
  AbilityForm
} from '~/abilities/models/AbilityForm.model'
import { AbilityFormData } from '~/abilities/models/AbilityFormData.model'
import { AbilityType } from '~/abilities/models/AbilityType.model'
import { AbilityUsage } from '~/abilities/models/AbilityUsage.model'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { TextFieldComponent } from '~/shared/components/ui/text-field/text-field.component'
import { TextareaFieldComponent } from '~/shared/components/ui/textarea-field/textarea-field.component'
import { educationalExperienceOptions } from '~/shared/data/educationalExperienceOptions'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { AbilityActionGridListFormComponent } from '../ability-action-grid-list-form/ability-action-grid-list-form.component'

export type AbilityFormSubmit = {
  result: {
    id: string | null
    formData: AbilityFormData
  }
  onFinish: () => void
  onError: () => void
}

@Component({
  selector: 'gow-ability-form-dialog',
  templateUrl: 'ability-form-dialog.component.html',
  imports: [
    AbilityActionGridListFormComponent,
    ButtonModule,
    SelectFieldComponent,
    TextFieldComponent,
    TextareaFieldComponent,
    ReactiveFormsModule,
    ToggleSwitchModule,
    DialogModule,
    LucideAngularModule
  ]
})
export class AbilityFormDialogComponent {
  public readonly closeIcon = X

  public readonly abilityTypeOptions = abilityTypeOptions
  public readonly abilityClassShiftOptions = abilityClassShiftOptions
  public readonly abilityUsageOptions = abilityUsageOptions
  public readonly educationalExperienceOptions = educationalExperienceOptions
  public readonly usageType = AbilityUsage

  @Input() abilityForm?: FormGroup<AbilityForm> | null = null

  public abilityFormId = input<string | null>(null, { alias: 'id' })
  public showDialog = input.required<boolean>({ alias: 'show' })
  public headerTitle = input.required<string>({ alias: 'headerTitle' })
  public buttonText = input.required<string>({ alias: 'buttonText' })
  public buttonIcon = input.required<LucideIconData>({ alias: 'buttonIcon' })

  public isClassroomActionActive = signal<boolean>(false)
  public isSubmitLoading = signal<boolean>(false)

  public onClose = output<void>({ alias: 'close' })
  public onSubmit = output<AbilityFormSubmit>({
    alias: 'submit'
  })

  ngOnInit(): void {
    if (this.abilityForm === null) this.abilityForm = fullAbilityForm()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['abilityForm']) {
      const abilityForm = changes['abilityForm']
        .currentValue as typeof this.abilityForm

      if (abilityForm === null || !abilityForm) return

      const abilityActionsFormArray = abilityForm.get('actions') as FormArray

      this.verifyAbilityActionListFormState(abilityActionsFormArray)
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

  public onSubmitAbilityForm() {
    const abilityForm = this.abilityForm

    if (!abilityForm || abilityForm.invalid) return

    const data = abilityForm.getRawValue()

    this.isSubmitLoading.set(true)

    this.onSubmit.emit({
      result: {
        id: this.abilityFormId(),
        formData: data
      },
      onFinish: () => {
        this.onCloseDialog()
      },
      onError: () => {
        this.isSubmitLoading.set(false)
      }
    })
  }

  public onCloseDialog() {
    this.onClose.emit()
    this.isClassroomActionActive.set(false)
    this.isSubmitLoading.set(false)
    this.abilityForm = fullAbilityForm()
  }

  public onSetIsClassroomAction(value: boolean) {
    this.isClassroomActionActive.set(value)
  }

  private verifyAbilityActionListFormState(
    abilityActionListForm: FormArray<AbilityActionForm>
  ) {
    abilityActionListForm.getRawValue().forEach(actionForm => {
      if (actionForm.type === AbilityActionType.CLASSROOM)
        this.isClassroomActionActive.set(true)
    })
  }

  get nameControl(): AbstractControl<string> | null {
    return this.abilityForm?.get('name') ?? null
  }

  get descriptionControl(): AbstractControl<string> | null {
    return this.abilityForm?.get('description') ?? null
  }

  get isInitialControl(): AbstractControl<boolean> | null {
    return this.abilityForm?.get('isInitial') ?? null
  }

  get typeControl(): AbstractControl<AbilityType> | null {
    return this.abilityForm?.get('type') ?? null
  }

  get educationalExperienceControl(): AbstractControl<EducationalExperience> | null {
    return this.abilityForm?.get('experience') ?? null
  }

  get usageTypeControl(): AbstractControl<AbilityUsage> | null {
    return this.abilityForm?.get('usage.type') ?? null
  }

  get usageShiftControl(): AbstractControl<AbilityClassShift> | null {
    return this.abilityForm?.get('usage.shift') ?? null
  }

  get abilityActionsFormArray(): FormArray {
    return this.abilityForm?.get('actions') as FormArray
  }
}
