import {
  Component,
  Input,
  inject,
  OnChanges,
  SimpleChanges,
  signal,
  output
} from '@angular/core'
import {
  AbstractControl,
  FormArray,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { Check, LucideAngularModule, X } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { Toast } from 'primeng/toast'
import { answerOptionForm } from '~/homeworks/forms/answerOptionForm'
import { AnswerOptionModel } from '~/homeworks/models/AnswerOption.model'
import { AnswerOptionForm } from '~/homeworks/models/AnswerOptionForm.model'
import { AnswerOptionFormData } from '~/homeworks/models/AnswerOptionFormData.model'
import { HomeworkSingleChoiseContentForm } from '~/homeworks/models/HomeworkForm.model'
import { AnswerOptionService } from '~/homeworks/services/answer-option/answer-option.service'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import { SelectOption } from '~/shared/types/SelectOption'
import { AnswerOptionListItemComponent } from './components/answer-option-list-item.component'

const answerOptionsLoadingErrorMessages: ErrorMessages = {
  'homework-not-exist': {
    summary: 'Tarea no existente',
    message: 'La tarea ha sido encontrada'
  },
  'homework-is-not-single-choice': {
    summary: 'Conflicto con la tarea',
    message: 'La tarea debe ser de elección unica'
  },
  ...commonErrorMessages
}

@Component({
  selector: 'gow-single-choise-content-form',
  templateUrl: './single-choise-content-form.component.html',
  imports: [
    ReactiveFormsModule,
    SelectFieldComponent,
    Toast,
    ButtonModule,
    LucideAngularModule,
    AnswerOptionListItemComponent
  ],
  providers: [MessageService]
})
export class SingleChoiseContentFormComponent implements OnChanges {
  public readonly acceptIcon = Check
  public readonly notAcceptIcon = X

  private readonly answerOptionService = inject(AnswerOptionService)

  private readonly toastService = inject(MessageService)

  @Input() contentFormGroup!: FormGroup<HomeworkSingleChoiseContentForm>
  @Input() homeworkId?: string | number | null = null

  public answerOptions = signal<SelectOption[]>([])
  public isAnswersLoading = signal<boolean>(false)

  public showCreateAnswerOptionForm = signal<boolean>(false)
  public createAnswerOptionForm = signal<FormGroup<AnswerOptionForm> | null>(
    null
  )

  ngOnChanges(changes: SimpleChanges): void {
    this.answerOptions.set([])

    if (changes['homeworkId']) {
      const contentFormData = this.contentFormGroup.getRawValue()

      const homeworkId = this.homeworkId
      const correctOption = contentFormData.correctOption
      const answerOptions = contentFormData.options

      if (
        correctOption === '' ||
        typeof homeworkId !== 'string' ||
        homeworkId === null ||
        answerOptions.length !== 0
      ) {
        const selectOptions: SelectOption[] = answerOptions.map(option => ({
          code: option.id || option.answer,
          name: option.answer
        }))

        this.answerOptions.set(selectOptions)

        if (correctOption !== '')
          this.correctOptionControl.patchValue(correctOption)

        return
      }

      this.loadAnswers(homeworkId, correctOption)
    }
  }

  public onOpenCreateAnswerOptionForm() {
    this.createAnswerOptionForm.set(answerOptionForm())
  }

  public onCloseCreateAnswerOptionForm() {
    this.createAnswerOptionForm.set(null)
  }

  public onAddAnswerOptionForm() {
    const createAnswerOptionForm = this.createAnswerOptionForm()

    if (createAnswerOptionForm === null) return

    const newAnswerOptionData = createAnswerOptionForm.getRawValue()
    createAnswerOptionForm.patchValue({
      answer: newAnswerOptionData.answer.trim()
    })

    this.answersFormArray.push(createAnswerOptionForm)
    this.answerOptions.update(options => {
      return [
        ...options,
        { code: newAnswerOptionData.answer, name: newAnswerOptionData.answer }
      ]
    })
    this.createAnswerOptionForm.set(null)
  }

  public onRemoveAnswerOptionForm(position: number) {
    this.answersFormArray.removeAt(position)
    this.answerOptions.update(options =>
      options.filter((_, i) => i !== position)
    )

    const currentCorrectOption = this.correctOptionControl.getRawValue()

    const answerOptionExist =
      this.answerOptions().find(
        option =>
          option.code === currentCorrectOption ||
          option.name === currentCorrectOption
      ) !== undefined

    if (!answerOptionExist) {
      this.correctOptionControl.setValue('')
    }
  }

  public onEditAnswerOptionForm({
    position,
    data
  }: {
    position: number
    data: AnswerOptionFormData
  }) {
    this.answerOptions.update(options => {
      options[position] = {
        name: data.answer,
        code: data.id ?? data.answer
      }

      return options
    })

    this.correctOptionControl.setValue(data.id ?? data.answer)
  }

  public hasErrorValidation(
    control: AbstractControl | null,
    validationKey: string
  ) {
    if (control === null) return false
    return control?.pristine || control?.hasError(validationKey)
  }

  private loadAnswers(homeworkId: string, correctOptionId: string) {
    this.isAnswersLoading.set(true)

    this.answerOptionService
      .getAnswerOptionsByHomeworkIdAsync(homeworkId)
      .then(answerOptions => {
        this.setAnswerOptions(answerOptions)
        this.correctOptionControl.setValue(correctOptionId)
        this.isAnswersLoading.set(false)
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showAnswerOptionsLoadingErrorMessage(error.code)
      })
  }

  private setAnswerOptions(answerOptions: AnswerOptionModel[]) {
    const selectOptions: SelectOption[] = answerOptions.map(option => ({
      code: option.id,
      name: option.answer
    }))

    this.answerOptions.set(selectOptions)

    answerOptions.forEach(option => {
      this.answersFormArray.push(
        answerOptionForm({ id: option.id, answer: option.answer })
      )
    })
  }

  private showAnswerOptionsLoadingErrorMessage(code: string) {
    const { summary, message } = answerOptionsLoadingErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showErrorMessage(summary: string, detail: string) {
    this.toastService.add({ severity: 'error', summary, detail })
  }

  get correctOptionControl(): AbstractControl<string> {
    return this.contentFormGroup.get('correctOption') as AbstractControl<string>
  }

  get answersFormArray(): FormArray<FormGroup<AnswerOptionForm>> {
    return this.contentFormGroup.get('options') as FormArray<
      FormGroup<AnswerOptionForm>
    >
  }
}
