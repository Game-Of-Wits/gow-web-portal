import { Component, Input, signal } from '@angular/core'
import { FormArray, FormGroup } from '@angular/forms'
import { PenaltyForm } from '~/penalties/models/PenaltyForm.model'
import { PenaltyFormDialogComponent } from '../penalty-form-dialog/penalty-form-dialog.component'
import { PenaltyListFormItemComponent } from '../penalty-list-form-item/penalty-list-form-item.component'

@Component({
  selector: 'gow-penalty-list-form',
  templateUrl: './penalty-list-form.component.html',
  imports: [PenaltyFormDialogComponent, PenaltyListFormItemComponent]
})
export class PenaltyListFormComponent {
  @Input() penaltyListForm!: FormArray<FormGroup<PenaltyForm>>

  public showAddPenaltyFormDialog = signal<boolean>(false)
  public showEditPenaltyFormDialog = signal<boolean>(false)

  public penaltyFormSelected = signal<{
    position: number
    form: FormGroup<PenaltyForm> | null
  }>({
    position: 0,
    form: null
  })

  public onOpenAddPenaltyFormDialog() {
    this.showAddPenaltyFormDialog.set(true)
    this.penaltyFormSelected.set({
      form: null,
      position: this.penaltyListForm.length
    })
  }

  public onOpenEditPenaltyFormDialog(data: {
    position: number
    form: FormGroup<PenaltyForm>
  }) {
    this.showEditPenaltyFormDialog.set(true)
    this.penaltyFormSelected.set({
      form: data.form,
      position: data.position
    })
  }

  public onClosePenaltyFormDialog() {
    this.showAddPenaltyFormDialog.set(false)
    this.showEditPenaltyFormDialog.set(false)
    this.penaltyFormSelected.set({
      form: null,
      position: 0
    })
  }

  public onAddPenaltyForm(data: {
    position: number
    form: FormGroup<PenaltyForm>
  }) {
    this.penaltyListForm.push(data.form)
  }

  public onEditPenaltyForm(data: {
    position: number
    form: FormGroup<PenaltyForm>
  }) {}

  public onDeletePenaltyForm(position: number) {
    this.penaltyListForm.removeAt(position)
  }
}
