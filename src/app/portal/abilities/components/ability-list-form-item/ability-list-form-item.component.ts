import { Component, Input, input, output } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { LucideAngularModule, Pencil, Sparkle, Trash2 } from 'lucide-angular'
import { abilityTypeFormats } from '~/abilities/data/formats'
import { AbilityForm } from '~/abilities/models/AbilityForm.model'

@Component({
  selector: 'gow-ability-list-form-item',
  templateUrl: './ability-list-form-item.component.html',
  imports: [LucideAngularModule]
})
export class AbilityListFormItemComponent {
  public readonly abilityIcon = Sparkle
  public readonly editIcon = Pencil
  public readonly deleteIcon = Trash2
  public readonly abilityTypeFormats = abilityTypeFormats

  @Input() public abilityForm!: FormGroup<AbilityForm>
  public abilityPosition = input.required<number>({ alias: 'position' })

  public onDelete = output<number>({ alias: 'delete' })
  public onEdit = output<{
    position: number
    form: FormGroup<AbilityForm>
  }>({ alias: 'edit' })

  public onEditForm() {
    this.onEdit.emit({
      position: this.abilityPosition(),
      form: this.abilityForm
    })
  }

  public onDeleteForm() {
    this.onDelete.emit(this.abilityPosition())
  }
}
