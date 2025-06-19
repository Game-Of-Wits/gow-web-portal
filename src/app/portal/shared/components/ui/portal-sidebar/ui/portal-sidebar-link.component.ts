import { Component, OnInit, inject, input, signal } from '@angular/core'
import { Router, RouterLink } from '@angular/router'

@Component({
  selector: 'gow-portal-sidebar-link',
  imports: [RouterLink],
  template: `
    <a
      [routerLink]="linkHref()"
      class="px-[16px] py-[10px] rounded-xl text-base leading-none gap-2.5 flex items-center transition-colors {{
          isActive()
            ? 'text-white bg-primary-500 hover:bg-primary-600'
            : 'text-dark hover:bg-surface-100'
        }}"
    >
      <ng-content select="[icon]"></ng-content>
      <span class="leading-none text-base {{ isActive() && 'font-bold' }}">
        <ng-content></ng-content>
      </span>
    </a>
  `
})
export class PortalSidebarLinkComponent implements OnInit {
  public router = inject(Router)

  public linkHref = input.required<string>({ alias: 'href' })
  public isActive = signal<boolean>(false)

  ngOnInit(): void {
    this.isActive.set(this.router.url.startsWith(this.linkHref()))
  }
}
