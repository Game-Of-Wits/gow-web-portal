import {
  Component,
  HostListener,
  Input,
  input,
  OnChanges,
  OnInit,
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
import { DialogModule } from 'primeng/dialog'
import {
  abilityClassShiftOptions,
  abilityTypeOptions
} from '~/abilities/data/options'
import { experienceAbilityForm } from '~/abilities/forms/experienceAbilityForm'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import {
  AbilityActionForm,
  AbilityForm
} from '~/abilities/models/AbilityForm.model'
import { AbilityType } from '~/abilities/models/AbilityType.model'
import { AbilityUsage } from '~/abilities/models/AbilityUsage.model'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { TextFieldComponent } from '~/shared/components/ui/text-field/text-field.component'
import { TextareaFieldComponent } from '~/shared/components/ui/textarea-field/textarea-field.component'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { AbilityActionListFormComponent } from '../ability-action-list-form/ability-action-list-form.component'

@Component({
  selector: 'gow-experience-ability-form-dialog',
  templateUrl: './experience-ability-form-dialog.component.html',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    TextFieldComponent,
    TextareaFieldComponent,
    AbilityActionListFormComponent,
    SelectFieldComponent,
    LucideAngularModule
  ]
})
export class ExperienceAbilityFormDialogComponent implements OnInit, OnChanges {
  public readonly closeIcon = X
  public readonly abilityTypeOptions = abilityTypeOptions
  public readonly abilityClassShiftOptions = abilityClassShiftOptions

  @Input() abilityForm?: FormGroup<AbilityForm> | null = null

  public abilityFormPosition = input<number>(0, { alias: 'position' })
  public showDialog = input.required<boolean>({ alias: 'show' })
  public headerTitle = input.required<string>({ alias: 'headerTitle' })
  public buttonText = input.required<string>({ alias: 'buttonText' })
  public buttonIcon = input.required<LucideIconData>({ alias: 'buttonIcon' })
  public abilityExperience = input.required<EducationalExperience>({
    alias: 'experience'
  })
  public abilityUsageType = input.required<AbilityUsage>({
    alias: 'abilityUsage'
  })

  public isClassroomActionActive = signal<boolean>(false)

  public onClose = output<void>({ alias: 'close' })
  public onSuccess = output<{
    position: number
    form: FormGroup<AbilityForm>
  }>({
    alias: 'success'
  })

  ngOnInit(): void {
    if (this.abilityForm === null)
      this.abilityForm = experienceAbilityForm(
        this.abilityExperience(),
        this.abilityUsageType()
      )
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

    this.onSuccess.emit({
      position: this.abilityFormPosition(),
      form: abilityForm
    })
    this.onCloseDialog()
  }

  public onCloseDialog() {
    this.onClose.emit()
    this.isClassroomActionActive.set(false)
    this.abilityForm = experienceAbilityForm(
      this.abilityExperience(),
      this.abilityUsageType()
    )
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

  get typeControl(): AbstractControl<AbilityType> | null {
    return this.abilityForm?.get('type') ?? null
  }

  get usageShiftControl(): AbstractControl<string> | null {
    return this.abilityForm?.get('usage.shift') ?? null
  }

  get descriptionControl(): AbstractControl<string> | null {
    return this.abilityForm?.get('description') ?? null
  }

  get abilityActionsFormArray(): FormArray {
    return this.abilityForm?.get('actions') as FormArray
  }
}
