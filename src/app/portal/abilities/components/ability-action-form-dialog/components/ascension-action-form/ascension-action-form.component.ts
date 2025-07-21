import { Component, Input, input } from '@angular/core'
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { abilityLevelScopeOptions } from '~/abilities/data/options'
import { AddAscensionActionForm } from '~/abilities/models/AbilityForm.model'
import { AbilityLevelScope } from '~/abilities/models/AbilityLevelScope.model'
import { NumberFieldComponent } from '~/shared/components/ui/number-field/number-field.component'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { AbilityActionColorSchema } from '../../ability-action-form-dialog.component'

@Component({
  selector: 'gow-ascension-action-form',
  templateUrl: './ascension-action-form.component.html',
  imports: [NumberFieldComponent, SelectFieldComponent, ReactiveFormsModule]
})
export class AscensionActionFormComponent {
  public readonly abilityLevelScopeOptions = abilityLevelScopeOptions

  @Input() actionForm!: FormGroup<AddAscensionActionForm>

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

  get takenControl(): AbstractControl<number> | null {
    return this.actionForm.get('taken')
  }

  get givenControl(): AbstractControl<number> | null {
    return this.actionForm.get('given')
  }

  get takenLevelScopeControl(): AbstractControl<AbilityLevelScope> | null {
    return this.actionForm.get('takenLevelScope')
  }
}
