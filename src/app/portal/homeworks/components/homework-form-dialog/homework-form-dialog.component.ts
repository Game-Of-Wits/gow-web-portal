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
import { homeworkCategoryOptions } from '~/homeworks/data/options/homeworkCategoryOptions'
import { homeworkForm } from '~/homeworks/forms/homeworkForm'
import { HomeworkCategory } from '~/homeworks/models/HomeworkCategory.model'
import {
  HomeworkContentForm,
  HomeworkForm
} from '~/homeworks/models/HomeworkForm.model'
import { HomeworkFormData } from '~/homeworks/models/HomeworkFormData.model'
import { ImagePreviewFieldComponent } from '~/shared/components/ui/image-preview-field/image-preview-field.component'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { TextFieldComponent } from '~/shared/components/ui/text-field/text-field.component'
import { SingleChoiseContentFormComponent } from './components/single-choise-content-form.component'

export type HomeworkFormSubmit = {
  result: {
    id: string
    formData: HomeworkFormData
  }
  onFinish: () => void
}

@Component({
  selector: 'gow-homework-form-dialog',
  templateUrl: './homework-form-dialog.component.html',
  imports: [
    DialogModule,
    LucideAngularModule,
    ButtonModule,
    TextFieldComponent,
    SelectFieldComponent,
    ReactiveFormsModule,
    ImagePreviewFieldComponent,
    SingleChoiseContentFormComponent
  ]
})
export class HomeworkFormDialogComponent implements OnInit {
  public readonly closeIcon = X

  public readonly homeworkCategory = HomeworkCategory
  public readonly homeworkCategoryOptions = homeworkCategoryOptions

  @Input() homeworkForm?: FormGroup<HomeworkForm> | null = null

  public homeworkGroupId = input.required<string>({ alias: 'homeworkGroupId' })
  public homeworkId = input<string | null>(null, { alias: 'id' })

  public showDialog = input.required<boolean>({ alias: 'show' })
  public headerTitle = input.required<string>({ alias: 'headerTitle' })
  public buttonText = input.required<string>({ alias: 'buttonText' })

  public isSubmitLoading = signal<boolean>(false)

  public onClose = output<void>({ alias: 'close' })
  public onSubmit = output<HomeworkFormSubmit>({
    alias: 'submit'
  })

  ngOnInit(): void {
    if (this.homeworkForm === null) this.homeworkForm = homeworkForm()
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
    const homeworkForm = this.homeworkForm

    if (!homeworkForm || homeworkForm.invalid) return

    this.isSubmitLoading.set(true)

    this.onSubmit.emit({
      result: {
        id: this.homeworkId() ?? '',
        formData: homeworkForm.getRawValue()
      },
      onFinish: () => {
        this.onCloseDialog()
      }
    })
  }

  public onCloseDialog() {
    this.homeworkForm = homeworkForm()
    this.onClose.emit()
    this.isSubmitLoading.set(false)
  }

  get nameControl(): AbstractControl<string> {
    return this.homeworkForm?.get('name') as AbstractControl<string>
  }

  get categoryControl(): AbstractControl<string> {
    return this.homeworkForm?.get('category') as AbstractControl<string>
  }

  get imageControl(): AbstractControl<File | null> {
    return this.homeworkForm?.get('image') as AbstractControl<File | null>
  }

  get contentFormGroup(): HomeworkContentForm {
    return this.homeworkForm?.get('content') as HomeworkContentForm
  }
}
