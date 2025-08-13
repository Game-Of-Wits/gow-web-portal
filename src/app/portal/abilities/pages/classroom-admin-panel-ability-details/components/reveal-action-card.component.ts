import { Component, input } from '@angular/core'
import {
  LucideAngularModule,
  LucideIconData,
  Sparkles,
  Target,
  UserRound,
  UsersRound
} from 'lucide-angular'
import { CardModule } from 'primeng/card'
import { TagModule } from 'primeng/tag'
import {
  abilityActionTypeFormats,
  abilityTargetFormats
} from '~/abilities/data/formats'
import { discoveryInformationFormats } from '~/abilities/data/formats/discoveryInformationFormats'
import { RevealActionModel } from '~/abilities/models/Ability.model'
import { DiscoveryInformation } from '~/abilities/models/DiscoveryInformation.model'

@Component({
  selector: 'gow-reveal-action-card',
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

        <li>
          <span class="font-bold block">Información</span>

          <div class="grid grid-cols-3 mt-3 gap-4">
            @for (info of action().information; track info) {
              <div class="flex items-center gap-2 flex-col">
                <i-lucide [img]="informationIconMap[info].icon" class="size-[25px] {{ informationIconMap[info].filled && 'fill-gray-800' }}" />
                <span class="text-base font-bold overflow-ellipsis line-clamp-2 text-center">{{ discoveryInformationFormats[info] }}</span>
              </div>
            }
          </div>
        </li>
      </ul>
    </p-card>
  `,
  imports: [LucideAngularModule, TagModule, CardModule]
})
export class RevealActionCardComponent {
  public readonly targetIcon = Target

  public readonly abilityActionTypeFormats = abilityActionTypeFormats
  public readonly abilityTargetFormats = abilityTargetFormats
  public readonly discoveryInformationFormats = discoveryInformationFormats

  public readonly informationIconMap: Record<
    DiscoveryInformation,
    {
      icon: LucideIconData
      filled: boolean
    }
  > = {
    [DiscoveryInformation.CHARACTER]: {
      icon: UserRound,
      filled: true
    },
    [DiscoveryInformation.TEAM]: {
      icon: UsersRound,
      filled: true
    },
    [DiscoveryInformation.ABILITIES]: {
      icon: Sparkles,
      filled: true
    }
  }

  public action = input.required<RevealActionModel>({
    alias: 'action'
  })
}
