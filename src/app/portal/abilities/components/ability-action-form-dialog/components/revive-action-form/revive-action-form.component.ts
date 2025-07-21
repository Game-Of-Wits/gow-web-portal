import { Component, Input, input } from '@angular/core'
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { abilityTargetOptions } from '~/abilities/data/options'
import { AddReviveActionForm } from '~/abilities/models/AbilityForm.model'
import { AbilityTarget } from '~/abilities/models/AbilityTarget.model'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { AbilityActionColorSchema } from '../../ability-action-form-dialog.component'

@Component({
  selector: 'gow-revive-action-form',
  templateUrl: './revive-action-form.component.html',
  imports: [SelectFieldComponent, ReactiveFormsModule]
})
export class ReviveActionFormComponent {
  public readonly abilityTargetOptions = abilityTargetOptions

  @Input() actionForm!: FormGroup<AddReviveActionForm>

  public colorScheme = input<AbilityActionColorSchema>('primary', {
    alias: 'colorScheme'
  })

  public hasErrorValidation(
    control: AbstractControl | null,
    validationKey: string
  ) {
    if (control === null) return false
    return control?.pristine || control?.hasError(validationKey)
  }

  get targetControl(): AbstractControl<AbilityTarget> | null {
    return this.actionForm.get('target')
  }
}
