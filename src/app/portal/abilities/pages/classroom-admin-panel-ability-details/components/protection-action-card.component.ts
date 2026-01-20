import { Component, input } from '@angular/core'
import { LucideAngularModule, Target, UsersRound } from 'lucide-angular'
import { CardModule } from 'primeng/card'
import { TagModule } from 'primeng/tag'
import { abilityActionTypeFormats } from '~/abilities/data/formats'
import { abilityProtectionTargetFormats } from '~/abilities/data/formats/abilityProtectionTargetFormats'
import { ProtectionActionModel } from '~/abilities/models/Ability.model'
import { AbilityProtectionTarget } from '~/abilities/models/AbilityProtectionTarget.model'

@Component({
  selector: 'gow-protection-action-card',
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
            <p>{{ abilityProtectionTargetFormats[action().target] }}</p>
          </div>
        </li>

        @if (action().target !== abilityProtectionTarget.YOURSELF) {
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
export class ProtectionActionCardComponent {
  public readonly targetIcon = Target
  public readonly maxTargetsIcon = UsersRound

  public readonly abilityActionTypeFormats = abilityActionTypeFormats
  public readonly abilityProtectionTargetFormats =
    abilityProtectionTargetFormats
  public readonly abilityProtectionTarget = AbilityProtectionTarget

  public action = input.required<ProtectionActionModel>({
    alias: 'action'
  })
}
