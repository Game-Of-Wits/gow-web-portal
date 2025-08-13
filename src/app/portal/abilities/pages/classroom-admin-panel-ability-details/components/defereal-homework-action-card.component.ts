import { Component, computed, input } from '@angular/core'
import { Hourglass, LucideAngularModule } from 'lucide-angular'
import { CardModule } from 'primeng/card'
import { TagModule } from 'primeng/tag'
import {
  abilityActionTypeFormats,
  abilityUnitTimeFormats
} from '~/abilities/data/formats'
import { DeferealHomeworkActionModel } from '~/abilities/models/Ability.model'

@Component({
  selector: 'gow-defereal-homework-action-card',
  template: `
    <p-card styleClass="w-full shadow-none border-2 border-gray-200">
      <ng-template #title>
        <span
          class="font-bold line-clamp-1 overflow-ellipsis"
          [title]="abilityActionTypeFormats[action().type]"
        >
          {{ abilityActionTypeFormats[action().type] }}
        </span>
      </ng-template>

      <ul class="flex flex-col gap-2.5">
        <li class="flex items-center gap-2">
          <i-lucide [img]="deferealHomeworkTimeIcon" class="size-11" />
          <div>
            <span class="font-bold block">Tiempo a postergar</span>
            <p>{{ deferealHomeworkTime() }}</p>
          </div>
        </li>
      </ul>
    </p-card>
  `,
  imports: [LucideAngularModule, TagModule, CardModule]
})
export class DeferealHomeworkActionCardComponent {
  public readonly deferealHomeworkTimeIcon = Hourglass

  public readonly abilityActionTypeFormats = abilityActionTypeFormats

  public action = input.required<DeferealHomeworkActionModel>({
    alias: 'action'
  })

  public deferealHomeworkTime = computed(() => {
    let unitTime = abilityUnitTimeFormats[this.action().unitTime]

    if (this.action().time === 1)
      unitTime = unitTime.slice(0, unitTime.length - 1)

    return this.action().time + ' ' + unitTime
  })
}
