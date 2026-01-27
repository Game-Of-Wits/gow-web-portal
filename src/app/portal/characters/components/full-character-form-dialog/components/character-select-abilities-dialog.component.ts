import { Component, input, output, signal } from '@angular/core'
import { LucideAngularModule, Sparkle, X } from 'lucide-angular'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { abilityTypeFormats } from '~/abilities/data/formats'
import { AbilityModel } from '~/abilities/models/Ability.model'

@Component({
  selector: 'gow-character-select-abilities-dialog',
  imports: [
    DialogModule,
    ButtonModule,
    LucideAngularModule,
    ProgressSpinnerModule
  ],
  providers: [],
  template: `
    <p-dialog
      header="Seleccionar habilidades"
      [modal]="true"
      [visible]="showDialog()"
      [draggable]="false"
      [resizable]="false"
      [closable]="false"
      [style]="{ 'max-width': '640px', width: '100%' }"
    >
      <ng-template #header>
        <div class="flex justify-between items-center w-full">
          <span class="font-bold text-xl">Seleccionar habilidades</span>

          <div class="flex items-center gap-2">
            <p-button
              type="button"
              severity="danger"
              (click)="onCompleteAbilitiesSelection()"
              styleClass="rounded-lg"
              label="Seleccionar"
            />

            <p-button
              rounded
              type="button"
              size="small"
              severity="secondary"
              styleClass="aspect-square"
              (click)="onCancelAbilitiesSelection()"
            >
              <i-lucide pButtonIcon [img]="closeIcon" class="text-gray-700" />
            </p-button>
          </div>
        </div>
      </ng-template>

      <div class="flex flex-col gap-4 h-full">
        <div class="flex flex-col gap-1.5 scroll-auto h-125">
          @for (ability of abilities(); track ability.id) {
            <label
              class="flex items-center justify-between py-3 px-3 rounded-lg cursor-pointer border-4 transition-[border-color] hover:bg-danger-50"
              [class.border-danger-500]="verifyIsSelected(ability.id)"
              [class.border-transparent]="!verifyIsSelected(ability.id)"
              [class.bg-danger-50]="verifyIsSelected(ability.id)"
            >
              <div class="flex items-center gap-1.5">
                <i-lucide
                  [img]="abilityIcon"
                  class="text-danger-500 fill-danger-500 size-7"
                />

                <span
                  class="text-lg line-clamp-1 overflow-ellipsis text-danger-600"
                  [title]="ability.name"
                >
                  {{ ability.name }}
                </span>
              </div>

              <span class="text-danger-600 text-lg font-bold">{{ abilityTypeFormats[ability.type] }}</span>

              <input
                type="checkbox"
                [checked]="verifyIsSelected(ability.id)"
                (change)="onToggleSelectAbility(ability.id, $event)"
                [value]="ability.id"
                class="hidden"
              />
            </label>
          } @empty {
            <div
              class="w-full h-full flex justify-center items-center rounded-2xl border-2 border-gray-300 border-dashed"
            >
              <span class="text-gray-500">No se encontro habilidades disponibles</span>
            </div>
          }
        </div>
      </div>
    </p-dialog>
  `
})
export class CharacterSelectAbilitiesdDialogComponent {
  public readonly closeIcon = X
  public readonly abilityIcon = Sparkle

  public readonly abilityTypeFormats = abilityTypeFormats

  public showDialog = input.required<boolean>({ alias: 'show' })
  public selectionLimit = input.required<number>({ alias: 'limit' })
  public abilities = input.required<AbilityModel[]>({ alias: 'abilities' })
  public defaultSelectedAbilities = input<string[]>([], {
    alias: 'defaultAbilities'
  })

  public newSelectedAbilities = signal<string[]>(
    this.defaultSelectedAbilities()
  )

  public onClose = output<void>({ alias: 'close' })
  public onComplete = output<string[]>({ alias: 'complete' })

  public onCompleteAbilitiesSelection() {
    this.onComplete.emit(this.newSelectedAbilities())
    this.onCancelAbilitiesSelection()
  }

  public onCancelAbilitiesSelection() {
    this.newSelectedAbilities.set(this.defaultSelectedAbilities())
    this.onClose.emit()
  }

  public verifyIsSelected(abilityId: string) {
    return this.newSelectedAbilities().includes(abilityId)
  }

  public onToggleSelectAbility(abilityId: string, event: Event) {
    const isSelected = this.verifyIsSelected(abilityId)

    if (!isSelected) {
      if (this.newSelectedAbilities().length === this.selectionLimit()) return
      this.newSelectedAbilities.update(abilityIds => [...abilityIds, abilityId])
      return
    }

    this.newSelectedAbilities.update(abilityIds =>
      abilityIds.filter(abilitySelectedId => abilitySelectedId !== abilityId)
    )
  }
}
