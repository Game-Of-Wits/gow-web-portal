import { Component, inject, input } from '@angular/core'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'

@Component({
  selector: 'gow-portal-sidebar-link',
  imports: [RouterLink, RouterLinkActive],
  styles: `
    .sidebar-link-active {
      color: white;
      background-color: var(--p-primary-500);

      &:hover {
        background-color: var(--p-primary-600);
      }

      & > span {
        font-weight: bold;
      }
    }
  `,
  template: `
    <a
      [routerLink]="linkHref()"
      routerLinkActive="sidebar-link-active"
      class="px-[16px] py-[10px] rounded-xl text-base leading-none gap-2.5 flex items-center transition-colors text-dark hover:bg-surface-100"
    >
      <ng-content select="[icon]"></ng-content>
      <span class="leading-none text-base">
        <ng-content></ng-content>
      </span>
    </a>
  `
})
export class PortalSidebarLinkComponent {
  public router = inject(Router)

  public linkHref = input.required<string>({ alias: 'href' })
}
