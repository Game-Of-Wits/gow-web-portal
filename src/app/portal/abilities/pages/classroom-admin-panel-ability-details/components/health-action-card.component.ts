import { Component, computed, input } from '@angular/core'
import {
  HeartMinus,
  HeartPlus,
  LucideAngularModule,
  Target,
  UsersRound
} from 'lucide-angular'
import { CardModule } from 'primeng/card'
import { TagModule } from 'primeng/tag'
import { abilityActionTypeFormats } from '~/abilities/data/formats'
import { abilityHealthTargetFormats } from '~/abilities/data/formats/abilityHealthTargetFormats'
import { HealthActionModel } from '~/abilities/models/Ability.model'
import { AbilityHealthTarget } from '~/abilities/models/AbilityHealthTarget.model'
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

        <li class="flex items-center gap-2">
          <i-lucide [img]="targetIcon" class="size-11" />
          <div>
            <span class="font-bold block">Objetivo</span>
            <p>{{ abilityHealthTargetFormats[action().target] }}</p>
          </div>
        </li>

        @if (action().target !== abilityHealthTarget.YOURSELF) {
          <li class="flex items-center gap-2">
            <i-lucide [img]="maxTargetsIcon" class="size-11" />
            <div>
              <span class="font-bold block">Cantidad de objetivos</span>
              <p>{{ action().maxTargets }} objetivos</p>
            </div>
          </li>
        }
      </ul>
    </p-card>
  `,
  imports: [LucideAngularModule, TagModule, CardModule]
})
export class HealthActionCardComponent {
  public readonly decrementHealtlIcon = HeartMinus
  public readonly incrementHealtlIcon = HeartPlus
  public readonly targetIcon = Target
  public readonly maxTargetsIcon = UsersRound

  public readonly abilityActionTypeFormats = abilityActionTypeFormats
  public readonly abilityHealthTargetFormats = abilityHealthTargetFormats
  public readonly abilityHealthTarget = AbilityHealthTarget

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
