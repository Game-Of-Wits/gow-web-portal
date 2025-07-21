import {
  Component,
  HostListener,
  Input,
  input,
  OnInit,
  output
} from '@angular/core'
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { LucideAngularModule, X } from 'lucide-angular'
import { DialogModule } from 'primeng/dialog'
import { penaltyForm } from '~/penalties/forms/penaltyForm'
import { PenaltyForm } from '~/penalties/models/PenaltyForm.model'
import { NumberFieldComponent } from '~/shared/components/ui/number-field/number-field.component'
import { TextFieldComponent } from '~/shared/components/ui/text-field/text-field.component'

@Component({
  selector: 'gow-penalty-form-dialog',
  templateUrl: './penalty-form-dialog.component.html',
  imports: [
    DialogModule,
    TextFieldComponent,
    NumberFieldComponent,
    ReactiveFormsModule,
    LucideAngularModule
  ]
})
export class PenaltyFormDialogComponent implements OnInit {
  public readonly closeIcon = X

  @Input() penaltyForm?: FormGroup<PenaltyForm> | null = null

  public penaltyFormPosition = input.required<number>({ alias: 'position' })
  public showDialog = input.required<boolean>({ alias: 'show' })
  public headerTitle = input.required<string>({ alias: 'headerTitle' })
  public buttonText = input.required<string>({ alias: 'buttonText' })

  public onClose = output<void>({ alias: 'close' })
  public onSuccess = output<{
    position: number
    form: FormGroup<PenaltyForm>
  }>({
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

    this.onSuccess.emit({
      position: this.penaltyFormPosition(),
      form: penaltyForm
    })
    this.onCloseDialog()
  }

  public onCloseDialog() {
    this.onClose.emit()
    this.penaltyForm = penaltyForm()
  }

  get nameControl(): AbstractControl<string> | null {
    return this.penaltyForm?.get('name') ?? null
  }

  get reducePointsControl(): AbstractControl<number> | null {
    return this.penaltyForm?.get('reducePoints') ?? null
  }
}
