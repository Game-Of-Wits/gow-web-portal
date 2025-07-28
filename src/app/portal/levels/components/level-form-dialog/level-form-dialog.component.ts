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
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { LucideAngularModule, X } from 'lucide-angular'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { levelForm } from '~/levels/forms'
import { LevelForm } from '~/levels/models/LevelForm.model'
import { NumberFieldComponent } from '~/shared/components/ui/number-field/number-field.component'
import { TextFieldComponent } from '~/shared/components/ui/text-field/text-field.component'
import { LevelPrimaryColorPickerComponent } from '../level-primary-color-picker/level-primary-color-picker.component'

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
    LucideAngularModule
  ]
})
export class LevelFormDialogComponent implements OnChanges, OnInit {
  public readonly closeIcon = X

  @Input() levelForm?: FormGroup<LevelForm> | null = null
  @Input() minRequiredPoints!: number
  @Input() maxRequiredPoints?: number | null = null

  public levelFormPosition = input.required<number>({ alias: 'position' })
  public showDialog = input.required<boolean>({ alias: 'show' })
  public headerTitle = input.required<string>({ alias: 'headerTitle' })
  public buttonText = input.required<string>({ alias: 'buttonText' })
  public isLoading = input<boolean>(false, { alias: 'isLoading' })

  public onClose = output<void>({ alias: 'close' })
  public onSuccess = output<{
    position: number
    form: FormGroup<LevelForm>
  }>({
    alias: 'success'
  })

  ngOnInit(): void {
    if (this.levelForm === null) {
      this.levelForm = levelForm({
        max: null,
        min: this.minRequiredPoints
      })
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['minRequiredPoints']) {
      const currentMinRequiredPoints = changes['minRequiredPoints'].currentValue

      this.levelForm = levelForm({
        max: this.maxRequiredPoints ?? null,
        min: currentMinRequiredPoints
      })
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

    this.onSuccess.emit({
      position: this.levelFormPosition(),
      form: levelForm
    })
    this.onCloseDialog()
  }

  public onCloseDialog() {
    this.onClose.emit()
    this.levelForm = levelForm({
      max: null,
      min: this.minRequiredPoints
    })
  }

  get nameControl(): AbstractControl<string> | null {
    return this.levelForm?.get('name') ?? null
  }

  get requiredPointsControl(): AbstractControl<number> | null {
    return this.levelForm?.get('requiredPoints') ?? null
  }

  get primaryColorPoints(): AbstractControl<string> | null {
    return this.levelForm?.get('primaryColor') ?? null
  }
}
