import { Component, Input, input, signal } from '@angular/core'
import { FormArray } from '@angular/forms'
import { LucideAngularModule, Plus } from 'lucide-angular'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AbilityActionForm } from '~/abilities/models/AbilityForm.model'
import { AbilityActionFormDialogComponent } from '../ability-action-form-dialog/ability-action-form-dialog.component'
import { AbilityActionListFormItemComponent } from '../ability-action-list-form-item/ability-action-list-form-item.component'

@Component({
  selector: 'gow-ability-action-list-form',
  templateUrl: './ability-action-list-form.component.html',
  imports: [
    AbilityActionListFormItemComponent,
    AbilityActionFormDialogComponent,
    LucideAngularModule
  ]
})
export class AbilityActionListFormComponent {
  public readonly addIcon = Plus

  @Input() abilityActionListForm!: FormArray<AbilityActionForm>
  @Input() onSetIsClassroomAction!: (value: boolean) => void

  public isClassroomActionActive = input.required<boolean>({
    alias: 'isClassroomAction'
  })

  public showAddAbilityActionFormDialog = signal<boolean>(false)
  public showEditAbilityActionFormDialog = signal<boolean>(false)

  public abilityActionFormSelected = signal<{
    position: number
    form: AbilityActionForm | null
  }>({
    position: 0,
    form: null
  })

  public onOpenAddAbilityActionFormDialog() {
    this.showAddAbilityActionFormDialog.set(true)
    this.abilityActionFormSelected.set({
      position: this.abilityActionListForm.length,
      form: null
    })
  }

  public onOpenEditAbilityActionFormDialog(data: {
    position: number
    form: AbilityActionForm
  }) {
    this.showEditAbilityActionFormDialog.set(true)
    this.abilityActionFormSelected.set({
      position: data.position,
      form: data.form
    })
  }

  public onCloseAbilityActionForm() {
    this.showAddAbilityActionFormDialog.set(false)
    this.showEditAbilityActionFormDialog.set(false)
    this.abilityActionFormSelected.set({
      position: 0,
      form: null
    })
  }

  public onAddAbilityActionForm(data: {
    position: number
    form: AbilityActionForm
  }) {
    this.syncAbilityActionListFormState(data.form, () => {
      this.abilityActionListForm.push(data.form)
    })
  }

  public onEditAbilityActionForm(data: {
    position: number
    form: AbilityActionForm
  }) {
    this.syncAbilityActionListFormState(data.form)
  }

  public onDeleteAbilityActionForm(data: {
    position: number
    form: AbilityActionForm
  }) {
    if (data.form.getRawValue().type === AbilityActionType.CLASSROOM)
      this.onSetIsClassroomAction(false)

    this.abilityActionListForm.removeAt(data.position)
  }

  private syncAbilityActionListFormState(
    abilityForm: AbilityActionForm,
    finallyFn?: () => void
  ) {
    const isClassroom =
      abilityForm.getRawValue().type === AbilityActionType.CLASSROOM
    const isClassroomActive = this.isClassroomActionActive()

    if (isClassroom && isClassroomActive) return

    if (isClassroom) {
      this.onSetIsClassroomAction(true)
      this.abilityActionListForm.clear()
      this.abilityActionListForm.push(abilityForm)
      return
    }

    if (isClassroomActive) {
      this.onSetIsClassroomAction(false)
      this.abilityActionListForm.clear()
      this.abilityActionListForm.push(abilityForm)
      return
    }

    finallyFn?.()
  }
}
