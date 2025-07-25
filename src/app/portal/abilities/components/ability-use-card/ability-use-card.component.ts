import { DatePipe } from '@angular/common'
import { Component, input } from '@angular/core'
import { LucideAngularModule, Sparkle, User } from 'lucide-angular'
import { AbilityUseModel } from '~/abilities/models/AbilityUse.model'

export type AbilityUseCardColorScheme = 'primary' | 'info' | 'danger'

@Component({
  selector: 'gow-ability-use-card',
  templateUrl: './ability-use-card.component.html',
  imports: [DatePipe, LucideAngularModule]
})
export class AbilityUseCardComponent {
  public readonly abilityIcon = Sparkle
  public readonly defaultAvatar = User

  public readonly colorSchemeMap: Record<
    AbilityUseCardColorScheme,
    { text: string; background: string }
  > = {
    primary: {
      background: 'bg-primary-100',
      text: 'text-primary-500'
    },
    info: {
      background: 'bg-info-100',
      text: 'text-info-500'
    },
    danger: {
      background: 'bg-danger-100',
      text: 'text-danger-500'
    }
  }

  public colorScheme = input<AbilityUseCardColorScheme>('primary', {
    alias: 'colorScheme'
  })
  public abilityUse = input.required<AbilityUseModel>({
    alias: 'abilityUse'
  })
}
