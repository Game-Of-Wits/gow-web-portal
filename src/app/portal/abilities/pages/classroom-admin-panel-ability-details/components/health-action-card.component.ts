import { Component, computed, input } from '@angular/core'
import { HeartMinus, HeartPlus, LucideAngularModule } from 'lucide-angular'
import { CardModule } from 'primeng/card'
import { TagModule } from 'primeng/tag'
import { abilityActionTypeFormats } from '~/abilities/data/formats'
import { HealthActionModel } from '~/abilities/models/Ability.model'
import { AbilityModifier } from '~/abilities/models/AbilityModifier.model'

@Component({
  selector: 'gow-health-action-card',
  template: `
    <p-card styleClass="w-full shadow-none border-2 border-gray-200">
      <ng-template #title>
        <span class="font-bold line-clamp-1 overflow-ellipsis">{{ abilityActionTypeFormats[action().type] }}</span>
      </ng-template>

      <ul class="flex flex-col gap-2.5">
        <li class="flex items-center gap-2">
          <i-lucide [img]="isIncrementing() ? incrementHealtlIcon : decrementHealtlIcon" class="size-11" />
          <div>
            <span class="block font-bold">Puntos de vida</span>
            <p-tag [severity]="isIncrementing() ? 'success' : 'danger'" [value]="healthPointsText()" />
          </div>
        </li>
      </ul>
    </p-card>
  `,
  imports: [LucideAngularModule, TagModule, CardModule]
})
export class HealthActionCardComponent {
  public readonly decrementHealtlIcon = HeartMinus
  public readonly incrementHealtlIcon = HeartPlus

  public readonly abilityActionTypeFormats = abilityActionTypeFormats

  public action = input.required<HealthActionModel>({
    alias: 'action'
  })

  public isIncrementing = computed(
    () => this.action().modifier === AbilityModifier.INCREMENT
  )

  public healthPointsText = computed(() => {
    const indicator = this.isIncrementing() ? 'Incrementar +' : 'Descontar -'
    return indicator + this.action().healthPoints
  })
}
