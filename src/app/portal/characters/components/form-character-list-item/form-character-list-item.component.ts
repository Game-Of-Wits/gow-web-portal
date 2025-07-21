import { Component, Input, input, output } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { LucideAngularModule, Pencil, Trash2, User } from 'lucide-angular'
import { CharacterForm } from '~/characters/models/CharacterForm.model'

@Component({
  selector: 'gow-character-list-item',
  templateUrl: './form-character-list-item.component.html',
  imports: [LucideAngularModule]
})
export class FormCharacterListItemComponent {
  public readonly characterIcon = User
  public readonly editIcon = Pencil
  public readonly deleteIcon = Trash2

  @Input() public formCharacter!: FormGroup<CharacterForm>
  public position = input.required<number>({ alias: 'position' })

  public onDelete = output<number>({ alias: 'delete' })
  public onEdit = output<{
    position: number
    form: FormGroup<CharacterForm>
  }>({ alias: 'edit' })

  public onEditForm() {
    this.onEdit.emit({ position: this.position(), form: this.formCharacter })
  }

  public onDeleteForm() {
    this.onDelete.emit(this.position())
  }
}
