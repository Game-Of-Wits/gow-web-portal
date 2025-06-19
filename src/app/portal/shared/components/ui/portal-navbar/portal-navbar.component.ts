import { NgOptimizedImage } from '@angular/common'
import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'

import { SidebarStateStore } from '~/shared/store/sidebar.store'

import { ProfileMenuButtonComponent } from '~/shared/components/profile-menu-button/profile-menu-button.component'

import {
  LucideAngularModule,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-angular'

@Component({
  selector: 'gow-portal-navbar',
  templateUrl: './portal-navbar.component.html',
  imports: [
    NgOptimizedImage,
    RouterLink,
    LucideAngularModule,
    ProfileMenuButtonComponent
  ]
})
export class PortalNavbarComponent {
  readonly sidebarStore = inject(SidebarStateStore)

  readonly closePortalSidebar = PanelLeftClose
  readonly openPortalSidebar = PanelLeftOpen
}
