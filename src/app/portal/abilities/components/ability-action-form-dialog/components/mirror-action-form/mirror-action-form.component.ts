import { Component, Input, input } from '@angular/core'
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { AddMirrorActionForm } from '~/abilities/models/AbilityForm.model'
import { NumberFieldComponent } from '~/shared/components/ui/number-field/number-field.component'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { AbilityActionColorSchema } from '../../ability-action-form-dialog.component'
import { AbilityMirrorTarget } from '~/abilities/models/AbilityMirrorTarget.model'
import { abilityMirrorTargetOptions } from '~/abilities/data/options/abilityMirrorTargetOptions'

@Component({
  selector: 'gow-mirror-action-form',
  templateUrl: './mirror-action-form.component.html',
  imports: [SelectFieldComponent, ReactiveFormsModule, NumberFieldComponent]
})
export class MirrorActionFormComponent {
  public readonly abilityMirrorTargetOptions =
    abilityMirrorTargetOptions
  public readonly abilityMirrorTarget = AbilityMirrorTarget

  @Input() actionForm!: FormGroup<AddMirrorActionForm>

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

  get targetControl(): AbstractControl<AbilityMirrorTarget> | null {
    return this.actionForm.get('target')
  }

  get maxTargetsControl(): AbstractControl<number> | null {
    return this.actionForm.get('maxTargets')
  }
}
