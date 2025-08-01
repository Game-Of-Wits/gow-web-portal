import {
  Component,
  HostListener,
  Input,
  input,
  OnInit,
  output,
  signal
} from '@angular/core'
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { LucideAngularModule, X } from 'lucide-angular'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { penaltyForm } from '~/penalties/forms/penaltyForm'
import { PenaltyForm } from '~/penalties/models/PenaltyForm.model'
import { NumberFieldComponent } from '~/shared/components/ui/number-field/number-field.component'
import { TextFieldComponent } from '~/shared/components/ui/text-field/text-field.component'

export type PenaltyFormSubmit = {
  result: {
    id: number | string
    form: FormGroup<PenaltyForm>
  }
  onFinish: () => void
}

@Component({
  selector: 'gow-penalty-form-dialog',
  templateUrl: './penalty-form-dialog.component.html',
  imports: [
    DialogModule,
    ButtonModule,
    TextFieldComponent,
    NumberFieldComponent,
    ReactiveFormsModule,
    LucideAngularModule
  ]
})
export class PenaltyFormDialogComponent implements OnInit {
  public readonly closeIcon = X

  @Input() penaltyForm?: FormGroup<PenaltyForm> | null = null

  public penaltyFormId = input.required<number | string>({ alias: 'id' })
  public showDialog = input.required<boolean>({ alias: 'show' })
  public headerTitle = input.required<string>({ alias: 'headerTitle' })
  public buttonText = input.required<string>({ alias: 'buttonText' })

  public formLoading = signal<boolean>(false)

  public onClose = output<void>({ alias: 'close' })
  public onSuccess = output<PenaltyFormSubmit>({
    alias: 'success'
  })

  ngOnInit(): void {
    if (this.penaltyForm === null) this.penaltyForm = penaltyForm()
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.onCloseDialog()
  }

  public hasErrorValidation(
    control: AbstractControl | null,
    validationKey: string
  ) {
    return control?.pristine || control?.hasError(validationKey)
  }

  public onSubmitPenaltyForm() {
    const penaltyForm = this.penaltyForm

    if (!penaltyForm || penaltyForm.invalid) return

    this.formLoading.set(true)

    this.onSuccess.emit({
      result: {
        id: this.penaltyFormId(),
        form: penaltyForm
      },
      onFinish: () => {
        this.onCloseDialog()
      }
    })
  }

  public onCloseDialog() {
    this.penaltyForm = penaltyForm()
    this.onClose.emit()
    this.formLoading.set(false)
  }

  get nameControl(): AbstractControl<string> | null {
    return this.penaltyForm?.get('name') ?? null
  }

  get reducePointsControl(): AbstractControl<number> | null {
    return this.penaltyForm?.get('reducePoints') ?? null
  }
}
