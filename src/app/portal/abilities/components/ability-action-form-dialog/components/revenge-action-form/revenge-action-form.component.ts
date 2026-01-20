import { Component, Input, input } from '@angular/core'
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { AddRevengeActionForm } from '~/abilities/models/AbilityForm.model'
import { NumberFieldComponent } from '~/shared/components/ui/number-field/number-field.component'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { AbilityActionColorSchema } from '../../ability-action-form-dialog.component'
import { AbilityRevengeTarget } from '~/abilities/models/AbilityRevengeTarget.model'
import { abilityRevengeTargetOptions } from '~/abilities/data/options/abilityRevengeTargetOptions'

@Component({
  selector: 'gow-revenge-action-form',
  templateUrl: './revenge-action-form.component.html',
  imports: [SelectFieldComponent, ReactiveFormsModule, NumberFieldComponent]
})
export class RevengeActionFormComponent {
  public readonly abilityRevengeTargetOptions =
    abilityRevengeTargetOptions
  public readonly abilityRevengeTarget = AbilityRevengeTarget

  @Input() actionForm!: FormGroup<AddRevengeActionForm>

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

  get targetControl(): AbstractControl<AbilityRevengeTarget> | null {
    return this.actionForm.get('target')
  }

  get maxTargetsControl(): AbstractControl<number> | null {
    return this.actionForm.get('maxTargets')
  }
}
