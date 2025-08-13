import { Component, Input, input, output } from '@angular/core'
import { LucideAngularModule, Pencil, Trash2, Zap } from 'lucide-angular'
import { ButtonModule } from 'primeng/button'
import { abilityActionTypeFormats } from '~/abilities/data/formats'
import { AbilityActionType } from '~/abilities/models/AbilityActionType.model'
import { AbilityActionForm } from '~/abilities/models/AbilityForm.model'

export type AbilityActionSubmit = {
  position: number
  form: AbilityActionForm
}

@Component({
  selector: 'gow-ability-action-grid-list-form-item',
  templateUrl: './ability-action-grid-list-form-item.component.html',
  imports: [ButtonModule, LucideAngularModule]
})
export class AbilityActionGridListFormItemComponent {
  public readonly abilityActionIcon = Zap
  public readonly deleteIcon = Trash2
  public readonly editIcon = Pencil
  public readonly classroomAbilityActionType = AbilityActionType.CLASSROOM
  public readonly abilityActionTypeFormats = abilityActionTypeFormats

  @Input() abilityActionForm!: AbilityActionForm
  public abilityActionPosition = input.required<number>({ alias: 'position' })

  public onDelete = output<AbilityActionSubmit>({
    alias: 'delete'
  })
  public onEdit = output<AbilityActionSubmit>({
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
