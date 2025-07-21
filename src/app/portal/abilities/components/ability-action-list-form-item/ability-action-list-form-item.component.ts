import { Component, Input, input, output } from '@angular/core'
import { LucideAngularModule, Pencil, Trash2, Zap } from 'lucide-angular'
import { abilityActionTypeFormats } from '~/abilities/data/formats'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AbilityActionForm } from '~/abilities/models/AbilityForm.model'

@Component({
  selector: 'gow-ability-action-list-form-item',
  templateUrl: './ability-action-list-form-item.component.html',
  imports: [LucideAngularModule]
})
export class AbilityActionListFormItemComponent {
  public readonly abilityActionIcon = Zap
  public readonly deleteIcon = Trash2
  public readonly editIcon = Pencil
  public readonly classroomAbilityActionType = AbilityActionType.CLASSROOM
  public readonly abilityActionTypeFormats = abilityActionTypeFormats

  @Input() public abilityActionForm!: AbilityActionForm
  public abilityActionPosition = input.required<number>({ alias: 'position' })

  public onDelete = output<{ position: number; form: AbilityActionForm }>({
    alias: 'delete'
  })
  public onEdit = output<{ position: number; form: AbilityActionForm }>({
    alias: 'edit'
  })

  public onDeleteForm() {
    this.onDelete.emit({
      position: this.abilityActionPosition(),
      form: this.abilityActionForm
    })
  }

  public onEditForm() {
    this.onEdit.emit({
      position: this.abilityActionPosition(),
      form: this.abilityActionForm
    })
  }
}
