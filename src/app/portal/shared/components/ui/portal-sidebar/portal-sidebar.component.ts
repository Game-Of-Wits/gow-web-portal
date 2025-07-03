import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { House, LucideAngularModule, Plus, School } from 'lucide-angular'
import { LocalStorageService } from '~/shared/services/local-storage.service'
import { DefaultSchoolStore } from '~/shared/store/default-school.store'
import { SidebarStateStore } from '~/shared/store/sidebar.store'
import { PortalSidebarLinkComponent } from './ui/portal-sidebar-link.component'
import { PortalSidebarPaperComponent } from './ui/portal-sidebar-paper.component'

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
  public readonly sidebarStore = inject(SidebarStateStore)
  public readonly localStorage = inject(LocalStorageService)
  public readonly defaultSchoolStore = inject(DefaultSchoolStore)

  public readonly generalIcon = House
  public readonly classroomsIcon = School
  public readonly addClassroomIcon = Plus
}
