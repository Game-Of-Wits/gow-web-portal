import { Component, Input, input } from '@angular/core'
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { abilityProtectionTargetOptions } from '~/abilities/data/options/abilityProtectionTargetOptions'
import { AddProtectionActionForm } from '~/abilities/models/AbilityForm.model'
import { AbilityProtectionTarget } from '~/abilities/models/AbilityProtectionTarget.model'
import { NumberFieldComponent } from '~/shared/components/ui/number-field/number-field.component'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { AbilityActionColorSchema } from '../../ability-action-form-dialog.component'

@Component({
  selector: 'gow-protection-action-form',
  templateUrl: './protection-action-form.component.html',
  imports: [SelectFieldComponent, ReactiveFormsModule, NumberFieldComponent]
})
export class ProtectionActionFormComponent {
  public readonly abilityProtectionTargetOptions =
    abilityProtectionTargetOptions
  public readonly abilityProtectionTarget = AbilityProtectionTarget

  @Input() actionForm!: FormGroup<AddProtectionActionForm>

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

  get targetControl(): AbstractControl<AbilityProtectionTarget> | null {
    return this.actionForm.get('target')
  }

  get maxTargetsControl(): AbstractControl<number> | null {
    return this.actionForm.get('maxTargets')
  }
}
