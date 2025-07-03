import { NgOptimizedImage } from '@angular/common'
import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
  LucideAngularModule,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-angular'
import { ProfileMenuButtonComponent } from '~/shared/components/profile-menu-button/profile-menu-button.component'
import { LocalStorageService } from '~/shared/services/local-storage.service'
import { SidebarStateStore } from '~/shared/store/sidebar.store'

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
  private readonly localStorageService = inject(LocalStorageService)
  readonly sidebarStore = inject(SidebarStateStore)

  readonly closePortalSidebar = PanelLeftClose
  readonly openPortalSidebar = PanelLeftOpen

  public onToggleSidebar() {
    this.sidebarStore.toggle()

    if (this.sidebarStore.isOpen())
      this.localStorageService.setValue('open-sidebar', 'true')
    else this.localStorageService.removeValue('open-sidebar')
  }
}
