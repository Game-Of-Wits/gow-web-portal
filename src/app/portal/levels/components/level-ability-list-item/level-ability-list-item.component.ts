import { Component, input, output } from '@angular/core'
import { LucideAngularModule, Sparkle, Trash2 } from 'lucide-angular'
import { ButtonModule } from 'primeng/button'
import { AbilityModel } from '~/abilities/models/Ability.model'

@Component({
  selector: 'gow-level-ability-list-item',
  templateUrl: './level-ability-list-item.component.html',
  imports: [ButtonModule, LucideAngularModule]
})
export class LevelAbilityListItemComponent {
  public readonly abilityIcon = Sparkle
  public readonly deleteIcon = Trash2

  public ability = input.required<AbilityModel>({ alias: 'ability' })

  public onRemove = output<string>({ alias: 'remove' })
}
