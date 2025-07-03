import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { PortalNavbarComponent } from '~/shared/components/ui/portal-navbar/portal-navbar.component'
import { PortalSidebarComponent } from '~/shared/components/ui/portal-sidebar/portal-sidebar.component'

@Component({
  selector: 'gow-portal-layout',
  templateUrl: './portal-layout.component.html',
  imports: [RouterOutlet, PortalNavbarComponent, PortalSidebarComponent]
})
export class PortalLayoutComponent {}
