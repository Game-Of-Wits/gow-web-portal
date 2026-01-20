import { Component, Input, input } from '@angular/core'
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms'
import {
  LucideAngularModule,
  LucideIconData,
  Sparkles,
  UserRound,
  UsersRound
} from 'lucide-angular'
import { abilityRevealTargetOptions } from '~/abilities/data/options'
import { AddRevealActionForm } from '~/abilities/models/AbilityForm.model'
import { DiscoveryInformation } from '~/abilities/models/DiscoveryInformation.model'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { AbilityActionColorSchema } from '../../ability-action-form-dialog.component'
import { NumberFieldComponent } from '~/shared/components/ui/number-field/number-field.component'
import { AbilityRevealTarget } from '~/abilities/models/AbilityRevealTarget.model'

@Component({
  selector: 'gow-reveal-action-form',
  templateUrl: './reveal-action-form.component.html',
  imports: [
    SelectFieldComponent,
    NumberFieldComponent,
    ReactiveFormsModule,
    LucideAngularModule
  ]
})
export class RevealActionFormComponent {
  public readonly abilityRevealTargetOptions = abilityRevealTargetOptions
  public readonly abilityRevealTarget = AbilityRevealTarget
  public readonly discoveryInformationOptions: Array<{
    value: DiscoveryInformation
    icon: LucideIconData
    filled: boolean
    name: string
  }> = [
    {
      value: DiscoveryInformation.CHARACTER,
      icon: UserRound,
      filled: true,
      name: 'Personaje'
    },
    {
      value: DiscoveryInformation.TEAM,
      icon: UsersRound,
      filled: true,
      name: 'Equipo'
    },
    {
      value: DiscoveryInformation.ABILITIES,
      icon: Sparkles,
      filled: true,
      name: 'Habilidades'
    }
  ]

  @Input() actionForm!: FormGroup<AddRevealActionForm>

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

  public getDiscoveryInformationControl(
    discoveryInformation: DiscoveryInformation
  ): FormControl<boolean> {
    return this.actionForm
      .get('information')
      ?.get(discoveryInformation) as FormControl<boolean>
  }

  get informationControl(): AbstractControl | null {
    return this.actionForm.get('information')
  }

  get targetControl(): AbstractControl<AbilityRevealTarget> | null {
    return this.actionForm.get('target')
  }

  get maxTargetsControl(): AbstractControl<number> | null {
    return this.actionForm.get('maxTargets')
  }
}
