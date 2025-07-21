import { Component, Input, input, signal } from '@angular/core'
import { FormArray, FormGroup } from '@angular/forms'
import { LucideAngularModule, Pencil, Plus } from 'lucide-angular'
import type { CharacterForm } from '~/characters/models/CharacterForm.model'
import { SelectOption } from '~/shared/types/SelectOption'
import { CharacterFormDialogComponent } from '../character-form-dialog/character-form-dialog.component'
import { FormCharacterListItemComponent } from '../form-character-list-item/form-character-list-item.component'

@Component({
  selector: 'gow-initial-character-list-form',
  templateUrl: './initial-character-list-form.component.html',
  imports: [
    CharacterFormDialogComponent,
    FormCharacterListItemComponent,
    LucideAngularModule
  ]
})
export class InitialCharacterListFormComponent {
  public readonly addIcon = Plus
  public readonly editIcon = Pencil

  @Input() public characterListForm!: FormArray<FormGroup<CharacterForm>>

  public teamOptions = input<SelectOption[]>([], { alias: 'teamOptions' })

  public showAddCharacterFormDialog = signal<boolean>(false)
  public showEditCharacterFormDialog = signal<boolean>(false)

  public characterFormSelected = signal<{
    position: number
    form: FormGroup<CharacterForm> | null
  }>({ position: 0, form: null })

  public onOpenAddCharacterDialog() {
    this.characterFormSelected.set({
      position: this.characterListForm.length,
      form: null
    })
    this.showAddCharacterFormDialog.set(true)
  }

  public onOpenEditCharacterDialog(data: {
    position: number
    form: FormGroup<CharacterForm>
  }) {
    this.characterFormSelected.set({
      position: data.position,
      form: data.form
    })
    this.showEditCharacterFormDialog.set(true)
  }

  public onCloseCharacterForm() {
    this.showAddCharacterFormDialog.set(false)
    this.showEditCharacterFormDialog.set(false)
    this.characterFormSelected.set({
      position: 0,
      form: null
    })
  }

  public onAddCharacterForm(data: {
    position: number
    form: FormGroup<CharacterForm>
  }) {
    this.characterListForm.push(data.form)
  }

  public onEditCharacterForm(data: {
    position: number
    form: FormGroup<CharacterForm>
  }) {
    const name = data.form.get('name')?.value
    const teamName = data.form.get('teamName')?.value

    if (!name || !teamName || data.form.invalid) return

    this.characterListForm.at(data.position).setValue({
      name,
      teamName
    })
  }

  public onDeleteCharacterForm(position: number) {
    this.characterListForm.removeAt(position)
  }
}
