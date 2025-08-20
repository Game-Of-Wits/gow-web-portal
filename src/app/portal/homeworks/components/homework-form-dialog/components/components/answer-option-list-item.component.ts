import { Component, Input, input, output, signal } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Check, LucideAngularModule, Pencil, Trash2, X } from 'lucide-angular'
import { ButtonModule } from 'primeng/button'
import { AnswerOptionForm } from '~/homeworks/models/AnswerOptionForm.model'
import { AnswerOptionFormData } from '~/homeworks/models/AnswerOptionFormData.model'

@Component({
  selector: 'gow-answer-option-list-item',
  imports: [ReactiveFormsModule, LucideAngularModule, ButtonModule],
  template: `
    @if (showEditAnswerOption()) {
      <div
        class="flex items-center gap-4 py-1.5 pl-3 rounded-lg"
        [formGroup]="answerOptionForm"
      >
        <input
          class="w-full flex-1 outline-none border-b text-[1.1rem] border-gray-300 placeholder:text-gray-400 focus:border-gray-500 transition-colors"
          placeholder="Ingrese la respuesta"
          [autofocus]="true"
          formControlName="answer"
        />

        <div class="flex items-center gap-2">
          <button
            pButton
            rounded
            (click)="onEditAnswerOption()"
            class="cursor-pointer bg-success-50 hover:bg-success-100 border-none disabled:bg-gray-100 group disabled:cursor-not-allowed"
            [disabled]="answerOptionForm.get('answer')?.invalid"
          >
            <i-lucide
              pButtonIcon
              [img]="acceptIcon"
              class="size-5 text-success-500 group-disabled:text-gray-500"
            />
          </button>
          <button
            pButton
            rounded
            (click)="onCancelEdit()"
            class="cursor-pointer bg-danger-50 hover:bg-danger-100 border-none"
          >
            <i-lucide
              pButtonIcon
              [img]="notAcceptIcon"
              class="size-5 text-danger-500"
            />
          </button>
        </div>
      </div>
    } @else {
      <div
        class="bg-gray-100 flex items-center justify-between py-2.5 px-3.5 rounded-lg"
      >
        <span class="text-[1.1rem]">{{ answerOptionForm.get("answer")?.value }}</span>

        <div class="flex items-center gap-2.5">
          <button
            class="cursor-pointer group"
            (click)="onShowEdit()"
          >
            <i-lucide [img]="editIcon" class="size-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>
          <button
            class="cursor-pointer group"
            (click)="onRemove.emit(answerOptionPosition())"
          >
            <i-lucide [img]="deleteIcon" class="size-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>
        </div>
      </div>
    }
  `
})
export class AnswerOptionListItemComponent {
  public readonly editIcon = Pencil
  public readonly deleteIcon = Trash2
  public readonly acceptIcon = Check
  public readonly notAcceptIcon = X

  @Input() answerOptionForm!: FormGroup<AnswerOptionForm>
  public answerOptionPosition = input.required<number>({ alias: 'position' })

  public showEditAnswerOption = signal<boolean>(false)
  public editAnswerOptionRecovery = signal<AnswerOptionFormData | null>(null)

  public onRemove = output<number>({ alias: 'remove' })
  public onEdit = output<{ position: number; data: AnswerOptionFormData }>({
    alias: 'edit'
  })

  public onShowEdit() {
    this.showEditAnswerOption.set(true)

    const answerOptionData = this.answerOptionForm.getRawValue()

    this.editAnswerOptionRecovery.set({
      id: answerOptionData.id,
      answer: answerOptionData.answer.trim()
    })
  }

  public onEditAnswerOption() {
    this.onEdit.emit({
      position: this.answerOptionPosition(),
      data: this.answerOptionForm.getRawValue()
    })
    this.onCloseEdit()
  }

  public onCloseEdit() {
    this.editAnswerOptionRecovery.set(null)
    this.showEditAnswerOption.set(false)
  }

  public onCancelEdit() {
    const answerOptionRecovery = this.editAnswerOptionRecovery()

    if (answerOptionRecovery === null) return

    this.answerOptionForm.setValue(answerOptionRecovery)
  }
}
