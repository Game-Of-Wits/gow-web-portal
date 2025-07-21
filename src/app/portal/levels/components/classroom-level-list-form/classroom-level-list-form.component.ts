import { Component, Input, input, OnInit, signal } from '@angular/core'
import { FormArray, FormGroup } from '@angular/forms'
import { LucideAngularModule, Pencil, Plus } from 'lucide-angular'
import { LevelForm } from '~/levels/models/LevelForm.model'
import { ClassroomLevelListFormItemComponent } from '../classroom-level-list-form-item/classroom-level-list-form-item.component'
import { LevelFormDialogComponent } from '../level-form-dialog/level-form-dialog.component'

@Component({
  selector: 'gow-classroom-level-list-form',
  templateUrl: './classroom-level-list-form.component.html',
  imports: [
    LevelFormDialogComponent,
    ClassroomLevelListFormItemComponent,
    LucideAngularModule
  ]
})
export class ClassroomLevelListFormComponent {
  public readonly addIcon = Plus
  public readonly editIcon = Pencil

  @Input() levelListForm!: FormArray<FormGroup<LevelForm>>

  public disabled = input(false, { alias: 'disabled' })

  public showAddLevelFormDialog = signal<boolean>(false)
  public showEditLevelFormDialog = signal<boolean>(false)
  public levelFormSelected = signal<{
    position: number
    form: FormGroup<LevelForm> | null
    minRequiredPoints: number
  }>({
    position: 0,
    form: null,
    minRequiredPoints: 1
  })

  public onOpenAddLevelFormDialog() {
    this.levelFormSelected.set({
      position: this.levelListForm.length,
      form: null,
      minRequiredPoints: this.getLastLevelRequiredPoints()
    })
    this.showAddLevelFormDialog.set(true)
  }

  public onCloseLevelFormDialog() {
    this.showAddLevelFormDialog.set(false)
    this.showEditLevelFormDialog.set(false)
    this.levelFormSelected.set({
      position: 0,
      form: null,
      minRequiredPoints: 1
    })
  }

  public onAddLevelForm(data: {
    position: number
    form: FormGroup<LevelForm>
  }) {
    this.levelListForm.push(data.form)
  }

  public onDeleteLevelForm(position: number) {
    this.levelListForm.removeAt(position)
  }

  private getLastLevelRequiredPoints() {
    if (this.levelListForm.length === 0) return 1
    const lastLevelIndex = this.levelListForm.length - 1
    return (
      this.levelListForm.at(lastLevelIndex).getRawValue().requiredPoints + 1
    )
  }
}
