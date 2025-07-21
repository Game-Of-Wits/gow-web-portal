import { Component, Input, input, output } from '@angular/core'
import { FormGroup } from '@angular/forms'
import {
  LucideAngularModule,
  Pencil,
  Trash2,
  TriangleAlert
} from 'lucide-angular'
import { PenaltyForm } from '~/penalties/models/PenaltyForm.model'

@Component({
  selector: 'gow-penalty-list-form-item',
  templateUrl: './penalty-list-form-item.component.html',
  imports: [LucideAngularModule]
})
export class PenaltyListFormItemComponent {
  public readonly penaltyIcon = TriangleAlert
  public readonly deleteIcon = Trash2
  public readonly editIcon = Pencil

  @Input() penaltyForm!: FormGroup<PenaltyForm>
  public penaltyPosition = input.required<number>({ alias: 'position' })

  public onDelete = output<number>({ alias: 'delete' })
  public onEdit = output<{ position: number; form: FormGroup<PenaltyForm> }>({
    alias: 'edit'
  })

  public onDeleteForm() {
    this.onDelete.emit(this.penaltyPosition())
  }

  public onEditForm() {
    this.onEdit.emit({
      position: this.penaltyPosition(),
      form: this.penaltyForm
    })
  }
}
