import { Component, input } from '@angular/core'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  LucideAngularModule,
  Target
} from 'lucide-angular'
import { CardModule } from 'primeng/card'
import { TagModule } from 'primeng/tag'
import {
  abilityActionTypeFormats,
  abilityLevelScopeFormats
} from '~/abilities/data/formats'
import { AscensionActionModel } from '~/abilities/models/Ability.model'

@Component({
  selector: 'gow-ascension-action-card',
  template: `
    <p-card styleClass="w-full shadow-none border-2 border-gray-200">
      <ng-template #title>
        <span class="font-bold">{{ abilityActionTypeFormats[action().type] }}</span>
      </ng-template>

      <ul class="flex flex-col gap-2.5">
        <li class="flex items-center gap-2">
          <i-lucide [img]="givenIcon" class="size-11" />
          <div>
            <span class="font-bold block">Entregas...</span>
            <p-tag severity="danger" value="{{ action().given }} habilidades" />
          </div>
        </li>

        <li class="flex items-center gap-2">
          <i-lucide [img]="takenIcon" class="size-11" />
          <div>
            <span class="font-bold block">Obtienes...</span>
            <p-tag severity="success" value="{{ action().taken }} habilidades" />
          </div>
        </li>

        <li class="flex items-center gap-2">
          <i-lucide [img]="targetIcon" class="size-11" />
          <div>
            <span class="font-bold block">Alcance de la ascensión</span>
            <p-tag [value]="abilityLevelScopeFormats[action().takenLevelScope]" />
          </div>
        </li>
      </ul>
    </p-card>
  `,
  imports: [LucideAngularModule, TagModule, CardModule]
})
export class AscensionActionCardComponent {
  public readonly givenIcon = ArrowUpFromLine
  public readonly takenIcon = ArrowDownToLine
  public readonly targetIcon = Target

  public readonly abilityActionTypeFormats = abilityActionTypeFormats
  public readonly abilityLevelScopeFormats = abilityLevelScopeFormats

  public action = input.required<AscensionActionModel>({ alias: 'action' })
}
