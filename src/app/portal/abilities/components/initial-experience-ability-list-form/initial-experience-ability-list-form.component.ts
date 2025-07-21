import { Component, Input, input, signal } from '@angular/core'
import { FormArray, FormGroup } from '@angular/forms'
import { LucideAngularModule, Pencil, Plus } from 'lucide-angular'
import { AbilityForm } from '~/abilities/models/AbilityForm.model'
import { AbilityUsage } from '~/abilities/models/AbilityUsage.model'
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { AbilityListFormItemComponent } from '../ability-list-form-item/ability-list-form-item.component'
import { ExperienceAbilityFormDialogComponent } from '../experience-ability-form-dialog/experience-ability-form-dialog.component'

@Component({
  selector: 'gow-initial-experience-ability-list-form',
  templateUrl: './initial-experience-ability-list-form.component.html',
  imports: [
    ExperienceAbilityFormDialogComponent,
    AbilityListFormItemComponent,
    LucideAngularModule
  ]
})
export class InitialExperienceAbilityListFormComponent {
  public readonly addIcon = Plus
  public readonly editIcon = Pencil

  @Input() abilityListForm!: FormArray<FormGroup<AbilityForm>>

  public experience = input.required<EducationalExperience>({
    alias: 'experience'
  })
  public abilityUsage = input.required<AbilityUsage>({
    alias: 'abilityUsage'
  })

  public showAddAbilityFormDialog = signal<boolean>(false)
  public showEditAbilityFormDialog = signal<boolean>(false)

  public abilityFormSelected = signal<{
    position: number
    form: FormGroup<AbilityForm> | null
  }>({
    position: 0,
    form: null
  })

  public onOpenAddAbilityFormDialog() {
    this.abilityFormSelected.set({
      position: this.abilityListForm.length,
      form: null
    })
    this.showAddAbilityFormDialog.set(true)
  }

  public onOpenEditAbilityFormDialog(data: {
    position: number
    form: FormGroup<AbilityForm>
  }) {
    this.abilityFormSelected.set({
      position: data.position,
      form: data.form
    })
    this.showEditAbilityFormDialog.set(true)
  }

  public onCloseAddAbilityForm() {
    this.showAddAbilityFormDialog.set(false)
    this.abilityFormSelected.set({ position: 0, form: null })
  }

  public onAddAbilityForm(data: {
    position: number
    form: FormGroup<AbilityForm>
  }) {
    this.abilityListForm.push(data.form)
  }

  public onDeleteAbilityForm(position: number) {
    this.abilityListForm.removeAt(position)
  }

  public onEditAbilityForm(data: {
    position: number
    form: FormGroup<AbilityForm>
  }) {
    if (data.position < 0 || data.form.invalid) return
  }
}
