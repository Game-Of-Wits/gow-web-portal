import { Component, Input, input } from '@angular/core'
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { abilityTheftTargetOptions } from '~/abilities/data/options'
import { AddTheftActionForm } from '~/abilities/models/AbilityForm.model'
import { AbilityTheftTarget } from '~/abilities/models/AbilityTheftTarget.model'
import { NumberFieldComponent } from '~/shared/components/ui/number-field/number-field.component'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { AbilityActionColorSchema } from '../../ability-action-form-dialog.component'

@Component({
  selector: 'gow-theft-action-form',
  templateUrl: './theft-action-form.component.html',
  imports: [SelectFieldComponent, NumberFieldComponent, ReactiveFormsModule]
})
export class TheftActionFormComponent {
  public readonly abilityTheftTargetOptions = abilityTheftTargetOptions

  @Input() public actionForm!: FormGroup<AddTheftActionForm>

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

  get targetControl(): AbstractControl<AbilityTheftTarget> | null {
    return this.actionForm.get('target')
  }

  get numberOfAbilitiesControl(): AbstractControl<number> | null {
    return this.actionForm.get('numberOfAbilities')
  }
}
