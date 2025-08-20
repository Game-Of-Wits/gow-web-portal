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
import { ConfirmationService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { DialogModule } from 'primeng/dialog'
import { TextFieldComponent } from '~/shared/components/ui/text-field/text-field.component'
import { teamForm } from '~/teams/forms/teamForm'
import { TeamForm } from '~/teams/models/TeamForm.model'
import { TeamFormData } from '~/teams/models/TeamFormData.model'

export type TeamFormSubmit = {
  result: {
    id: string | null
    formData: TeamFormData
  }
  onFinish: () => void
}

@Component({
  selector: 'gow-team-form-dialog',
  templateUrl: './team-form-dialog.component.html',
  imports: [
    DialogModule,
    ButtonModule,
    TextFieldComponent,
    ReactiveFormsModule,
    LucideAngularModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService]
})
export class TeamFormDialogComponent implements OnInit {
  public readonly closeIcon = X

  @Input() teamForm?: FormGroup<TeamForm> | null = null
  public teamFormId = input<string | null>(null, { alias: 'id' })

  public showDialog = input.required<boolean>({ alias: 'show' })
  public headerTitle = input.required<string>({ alias: 'headerTitle' })
  public buttonText = input.required<string>({ alias: 'buttonText' })

  public isSubmitLoading = signal<boolean>(false)

  public onClose = output<void>({ alias: 'close' })
  public onSubmit = output<TeamFormSubmit>({
    alias: 'submit'
  })

  ngOnInit(): void {
    if (this.teamForm === null) this.teamForm = teamForm()
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

  public onSubmitForm() {
    const teamForm = this.teamForm

    if (!teamForm || teamForm.invalid) return

    this.isSubmitLoading.set(true)

    const formData = teamForm.getRawValue()

    this.onSubmit.emit({
      result: {
        id: this.teamFormId(),
        formData: {
          name: formData.name.trim()
        }
      },
      onFinish: () => {
        this.onCloseDialog()
      }
    })
  }

  public onCloseDialog() {
    this.teamForm = teamForm()
    this.onClose.emit()
    this.isSubmitLoading.set(false)
  }

  get nameControl(): AbstractControl<string> {
    return this.teamForm?.get('name') as AbstractControl<string>
  }
}
