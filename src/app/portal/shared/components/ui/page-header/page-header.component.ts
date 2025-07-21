import { Location } from '@angular/common'
import { Component, inject, input } from '@angular/core'
import { Router } from '@angular/router'
import { ArrowLeft, LucideAngularModule } from 'lucide-angular'

@Component({
  selector: 'gow-page-header',
  template: `
    <div class="flex gap-2.5 w-full">
      <button type="button" class="flex items-center justify-center cursor-pointer p-1 size-fit" (click)="onGoBack()">
        <i-lucide [img]="goBackIcon" class="text-primary-500 size-8" />
      </button>

      <div class="flex justify-between items-end w-full">
        <div class="flex flex-col">
          <p class="text-lg text-gray-400">{{ subtitle() }}</p>
          <h1 class="text-3xl font-bold leading-none">{{ title() }}</h1>
        </div>

        <ng-content />
      </div>
    </div>
  `,
  imports: [LucideAngularModule]
})
export class PageHeaderComponent {
  private readonly location = inject(Location)
  private readonly router = inject(Router)

  public readonly goBackIcon = ArrowLeft

  public title = input.required<string>({ alias: 'principalTitle' })
  public subtitle = input.required<string>({ alias: 'subtitle' })
  public defaultBackPath = input.required<string>({ alias: 'defaultBackPath' })

  public onGoBack() {
    if (window.history.length > 0) this.location.back()
    else this.router.navigate([this.defaultBackPath()])
  }
}
