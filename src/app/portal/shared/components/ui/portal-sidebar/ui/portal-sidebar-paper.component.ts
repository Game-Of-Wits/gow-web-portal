import { Component } from '@angular/core'

@Component({
  selector: 'gow-portal-sidebar-paper',
  imports: [],
  template: `
    <div
      class="px-[16px] py-[10px] rounded-xl text-base leading-none gap-2.5 flex items-center justify-between transition-colors text-dark"
    >
      <div class="flex gap-2 items-center">
        <ng-content select="[icon]"></ng-content>
        <span class="leading-none text-base">
          <ng-content></ng-content>
        </span>
      </div>
      <ng-content select="[actions]"></ng-content>
    </div>
  `
})
export class PortalSidebarPaperComponent {}
