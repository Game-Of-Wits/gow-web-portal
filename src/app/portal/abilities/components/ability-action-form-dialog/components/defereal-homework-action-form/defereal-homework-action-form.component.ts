import { Component, Input, input } from '@angular/core'
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { abilityUnitTimeOptions } from '~/abilities/data/options'
import { AddDeferealHomeworkActionForm } from '~/abilities/models/AbilityForm.model'
import { AbilityUnitTime } from '~/abilities/models/AbilityUnitTime.model'
import { NumberFieldComponent } from '~/shared/components/ui/number-field/number-field.component'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { AbilityActionColorSchema } from '../../ability-action-form-dialog.component'

@Component({
  selector: 'gow-defereal-homework-action-form',
  templateUrl: './defereal-homework-action-form.component.html',
  imports: [NumberFieldComponent, SelectFieldComponent, ReactiveFormsModule]
})
export class DeferealHomeworkActionFormComponent {
  public readonly abilityUnitTimeOptions = abilityUnitTimeOptions

  @Input() actionForm!: FormGroup<AddDeferealHomeworkActionForm>

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

  get unitTimeControl(): AbstractControl<AbilityUnitTime> | null {
    return this.actionForm.get('unitTime')
  }

  get timeControl(): AbstractControl<number> | null {
    return this.actionForm.get('time')
  }
}
