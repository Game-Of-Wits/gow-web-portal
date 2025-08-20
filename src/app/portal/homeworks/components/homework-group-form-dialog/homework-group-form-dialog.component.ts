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
import { LucideAngularModule, Save, X } from 'lucide-angular'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { homeworkGroupForm } from '~/homeworks/forms/homeworkGroupForm'
import { HomeworkGroupForm } from '~/homeworks/models/HomeworkGroupForm.model'
import { HomeworkGroupFormData } from '~/homeworks/models/HomeworkGroupFormData.model'
import { TextFieldComponent } from '~/shared/components/ui/text-field/text-field.component'

export type HomeworkGroupFormSubmit = {
  result: {
    id: string | number
    formData: HomeworkGroupFormData
  }
  onFinish: () => void
}

@Component({
  selector: 'gow-homework-group-form-dialog',
  templateUrl: './homework-group-form-dialog.component.html',
  imports: [
    DialogModule,
    ButtonModule,
    TextFieldComponent,
    ReactiveFormsModule,
    LucideAngularModule
  ]
})
export class HomeworkGroupFormDialogComponent implements OnInit {
  public readonly closeIcon = X
  public readonly saveIcon = Save

  @Input() homeworkGroupForm?: FormGroup<HomeworkGroupForm> | null = null

  public showDialog = input.required<boolean>({ alias: 'show' })
  public headerTitle = input.required<string>({ alias: 'headerTitle' })
  public buttonText = input.required<string>({ alias: 'buttonText' })

  public isSubmitLoading = signal<boolean>(false)

  public onClose = output<void>({ alias: 'close' })
  public onSubmit = output<HomeworkGroupFormSubmit>({
    alias: 'submit'
  })

  ngOnInit(): void {
    if (this.homeworkGroupForm === null)
      this.homeworkGroupForm = homeworkGroupForm()
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.onCloseDialog()
  }

  public onSubmitForm() {
    const homeworkGroupForm = this.homeworkGroupForm

    if (!homeworkGroupForm || homeworkGroupForm.invalid) return

    this.isSubmitLoading.set(true)

    this.onSubmit.emit({
      result: {
        id: 0,
        formData: homeworkGroupForm.getRawValue()
      },
      onFinish: () => {
        this.onCloseDialog()
      }
    })
  }

  public hasErrorValidation(
    control: AbstractControl | null,
    validationKey: string
  ) {
    if (control === null) return false
    return control?.pristine || control?.hasError(validationKey)
  }

  public onCloseDialog() {
    this.homeworkGroupForm = homeworkGroupForm()
    this.onClose.emit()
    this.isSubmitLoading.set(false)
  }

  get nameControl(): AbstractControl<string> {
    return this.homeworkGroupForm?.get('name') as AbstractControl<string>
  }
}
