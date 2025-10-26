import { DatePipe } from '@angular/common'
import { Component, input } from '@angular/core'
import { LucideAngularModule, Sparkle, User } from 'lucide-angular'
import { StudentAbilityUsageModel } from '~/abilities/models/StudentAbilityUsage.model'

export type AbilityUseCardColorScheme = 'primary' | 'info' | 'danger'

@Component({
  selector: 'gow-student-ability-usage-card',
  templateUrl: './student-ability-usage-card.component.html',
  imports: [DatePipe, LucideAngularModule]
})
export class StudentAbilityUsageCardComponent {
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
  public studentAbilityUsage = input.required<StudentAbilityUsageModel>({
    alias: 'studentAbilityUsage'
  })
}
