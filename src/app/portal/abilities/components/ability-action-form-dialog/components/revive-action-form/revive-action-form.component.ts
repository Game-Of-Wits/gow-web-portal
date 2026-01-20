import { Component, Input, input } from '@angular/core'
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { abilityReviveTargetOptions } from '~/abilities/data/options'
import { AddReviveActionForm } from '~/abilities/models/AbilityForm.model'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { AbilityActionColorSchema } from '../../ability-action-form-dialog.component'
import { NumberFieldComponent } from '~/shared/components/ui/number-field/number-field.component'
import { AbilityReviveTarget } from '~/abilities/models/AbilityReviveTarget.model'

@Component({
  selector: 'gow-revive-action-form',
  templateUrl: './revive-action-form.component.html',
  imports: [SelectFieldComponent, NumberFieldComponent, ReactiveFormsModule]
})
export class ReviveActionFormComponent {
  public readonly abilityReviveTargetOptions = abilityReviveTargetOptions
  public readonly abilityReviveTarget = AbilityReviveTarget

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

  get targetControl(): AbstractControl<AbilityReviveTarget> | null {
    return this.actionForm.get('target')
  }

  get maxTargetsControl(): AbstractControl<number> | null {
    return this.actionForm.get('maxTargets')
  }
}
