import { Component, input } from '@angular/core'
import { LucideAngularModule, Target } from 'lucide-angular'
import { CardModule } from 'primeng/card'
import { TagModule } from 'primeng/tag'
import {
  abilityActionTypeFormats,
  abilityTargetFormats
} from '~/abilities/data/formats'
import { ReviveActionModel } from '~/abilities/models/Ability.model'

@Component({
  selector: 'gow-revive-action-card',
  template: `
    <p-card styleClass="w-full shadow-none border-2 border-gray-200">
      <ng-template #title>
        <span class="font-bold">{{ abilityActionTypeFormats[action().type] }}</span>
      </ng-template>

      <ul class="flex flex-col gap-2.5">
        <li class="flex items-center gap-2">
          <i-lucide [img]="targetIcon" class="size-11" />
          <div>
            <span class="font-bold block">Objetivo</span>
            <p>{{ abilityTargetFormats[action().target] }}</p>
          </div>
        </li>
      </ul>
    </p-card>
  `,
  imports: [LucideAngularModule, TagModule, CardModule]
})
export class ReviveActionCardComponent {
  public readonly targetIcon = Target

  public readonly abilityActionTypeFormats = abilityActionTypeFormats
  public readonly abilityTargetFormats = abilityTargetFormats

  public action = input.required<ReviveActionModel>({
    alias: 'action'
  })
}
