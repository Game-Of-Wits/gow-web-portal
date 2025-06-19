import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'

import { LocalStorageService } from '~/shared/services/local-storage.service'

import { SidebarStateStore } from '~/shared/store/sidebar.store'

import { PortalSidebarLinkComponent } from './ui/portal-sidebar-link.component'
import { PortalSidebarPaperComponent } from './ui/portal-sidebar-paper.component'

import { House, LucideAngularModule, Plus, School } from 'lucide-angular'

@Component({
  selector: 'gow-portal-sidebar',
  templateUrl: './portal-sidebar.component.html',
  imports: [
    RouterLink,
    LucideAngularModule,
    PortalSidebarLinkComponent,
    PortalSidebarPaperComponent
  ]
})
export class PortalSidebarComponent {
  readonly sidebarStore = inject(SidebarStateStore)
  readonly localStorage = inject(LocalStorageService)

  readonly generalIcon = House
  readonly classroomsIcon = School
  readonly addClassroomIcon = Plus
}
