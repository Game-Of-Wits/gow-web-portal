import { Component, computed, input } from '@angular/core'
import { Gem, LucideAngularModule, Target } from 'lucide-angular'
import { CardModule } from 'primeng/card'
import { TagModule } from 'primeng/tag'
import {
  abilityActionTypeFormats,
  abilityTheftTargetFormats
} from '~/abilities/data/formats'
import { TheftActionModel } from '~/abilities/models/Ability.model'

@Component({
  selector: 'gow-theft-action-card',
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
            <p>{{ abilityTheftTargetFormats[action().target] }}</p>
          </div>
        </li>

        <li class="flex items-center gap-2">
          <i-lucide [img]="stoleAbilitiesIcon" class="size-11" />
          <div>
            <span class="font-bold block">Robar</span>
            <p-tag severity="danger" [value]="theftAbilitiesNumber()" />
          </div>
        </li>
      </ul>
    </p-card>
  `,
  imports: [LucideAngularModule, TagModule, CardModule]
})
export class TheftActionCardComponent {
  public readonly stoleAbilitiesIcon = Gem
  public readonly targetIcon = Target

  public readonly abilityActionTypeFormats = abilityActionTypeFormats
  public readonly abilityTheftTargetFormats = abilityTheftTargetFormats

  public action = input.required<TheftActionModel>({ alias: 'action' })

  public theftAbilitiesNumber = computed(() => {
    if (this.action().numberOfAbilities === 1) return 'Una habilidad'
    return this.action().numberOfAbilities + ' Habilidades'
  })
}
