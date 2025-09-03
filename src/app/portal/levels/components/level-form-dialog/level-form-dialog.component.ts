import {
  Component,
  computed,
  HostListener,
  Input,
  inject,
  input,
  OnChanges,
  OnInit,
  output,
  SimpleChanges,
  signal
} from '@angular/core'
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Info, LucideAngularModule, X } from 'lucide-angular'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { MessageModule } from 'primeng/message'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { levelForm } from '~/levels/forms'
import { LevelForm } from '~/levels/models/LevelForm.model'
import { LevelFormData } from '~/levels/models/LevelFormData.model'
import { NumberFieldComponent } from '~/shared/components/ui/number-field/number-field.component'
import { TextFieldComponent } from '~/shared/components/ui/text-field/text-field.component'
import { LevelPrimaryColorPickerComponent } from '../level-primary-color-picker/level-primary-color-picker.component'

export type LevelFormSubmit = {
  result: {
    id: number | string
    formData: LevelFormData
  }
  onFinish: () => void
}

@Component({
  selector: 'gow-level-form-dialog',
  templateUrl: './level-form-dialog.component.html',
  imports: [
    DialogModule,
    ButtonModule,
    TextFieldComponent,
    NumberFieldComponent,
    LevelPrimaryColorPickerComponent,
    ReactiveFormsModule,
    MessageModule,
    LucideAngularModule
  ]
})
export class LevelFormDialogComponent implements OnChanges, OnInit {
  public readonly closeIcon = X
  public readonly infoIcon = Info

  private readonly classroomContext = inject(ClassroomAdminPanelContextService)

  @Input() levelForm?: FormGroup<LevelForm> | null = null
  @Input() minRequiredPoints!: number
  @Input() maxRequiredPoints?: number | null = null

  public levelId = input.required<number | string>({ alias: 'id' })
  public showDialog = input.required<boolean>({ alias: 'show' })
  public headerTitle = input.required<string>({ alias: 'headerTitle' })
  public buttonText = input.required<string>({ alias: 'buttonText' })

  public isInitialLevel = signal(false)
  public formLoading = signal(false)

  public onClose = output<void>({ alias: 'close' })
  public onSubmit = output<LevelFormSubmit>({
    alias: 'submit'
  })

  public hasActiveAcademicPeriod = computed(
    () => this.classroomContext.activeAcademicPeriod() !== null
  )

  ngOnInit(): void {
    if (this.levelForm === null) {
      this.levelForm = levelForm({
        requiredPoints: this.minRequiredPoints,
        max: null
      })
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.levelForm === null) {
      if (changes['minRequiredPoints']) {
        const currentMinRequiredPoints =
          changes['minRequiredPoints'].currentValue

        this.levelForm = levelForm({
          requiredPoints: currentMinRequiredPoints,
          max: this.maxRequiredPoints ?? null
        })
      }
    }

    if (changes['levelForm']) {
      const levelForm = changes['levelForm']
        .currentValue as FormGroup<LevelForm> | null

      if (levelForm === null) return

      const levelFormData = levelForm.getRawValue()

      this.isInitialLevel.set(levelFormData.requiredPoints === 0)
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

  public onSubmitLevelForm() {
    const levelForm = this.levelForm

    if (!levelForm || levelForm.invalid) return

    this.formLoading.set(true)

    this.onSubmit.emit({
      result: {
        id: this.levelId(),
        formData: levelForm.getRawValue()
      },
      onFinish: () => {
        this.onCloseDialog()
      }
    })
  }

  public onCloseDialog() {
    this.levelForm = levelForm({
      requiredPoints: this.minRequiredPoints,
      max: null
    })
    this.onClose.emit()
    this.isInitialLevel.set(false)
    this.formLoading.set(false)
  }

  get nameControl(): AbstractControl<string> {
    return this.levelForm?.get('name') as AbstractControl<string>
  }

  get requiredPointsControl(): AbstractControl<number> {
    return this.levelForm?.get('requiredPoints') as AbstractControl<number>
  }

  get primaryColorControl(): AbstractControl<string> {
    return this.levelForm?.get('primaryColor') as AbstractControl<string>
  }
}
