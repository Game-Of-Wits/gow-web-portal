import { Component, Input, input } from '@angular/core'
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { abilityModifierOptions, abilityTargetOptions } from '~/abilities/data/options'
import { AddHealthActionForm } from '~/abilities/models/AbilityForm.model'
import { AbilityModifier } from '~/abilities/models/AbilityModifier.model'
import { AbilityTarget } from '~/abilities/models/AbilityTarget.model'
import { NumberFieldComponent } from '~/shared/components/ui/number-field/number-field.component'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { AbilityActionColorSchema } from '../../ability-action-form-dialog.component'

@Component({
  selector: 'gow-health-action-form',
  templateUrl: './health-action-form.component.html',
  imports: [SelectFieldComponent, NumberFieldComponent, ReactiveFormsModule]
})
export class HealthActionFormComponent {
  public readonly abilityModifierOptions = abilityModifierOptions
  public readonly abilityTargetOptions = abilityTargetOptions

  @Input() actionForm!: FormGroup<AddHealthActionForm>

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

  get healthPointsControl(): AbstractControl<number> | null {
    return this.actionForm.get('healthPoints')
  }

  get modifierControl(): AbstractControl<AbilityModifier> | null {
    return this.actionForm.get('modifier')
  }

  get targetControl(): AbstractControl<AbilityTarget> | null {
    return this.actionForm.get('target')
  }
}
