import { Component, input } from '@angular/core'
import { LucideAngularModule, Presentation } from 'lucide-angular'
import { PortalSidebarLinkComponent } from '~/shared/components/ui/portal-sidebar/ui/portal-sidebar-link.component'

@Component({
  selector: 'gow-classroom-sidebar-link',
  template: `
    <gow-portal-sidebar-link href="/p/s/{{ schoolId() }}/c/{{ classroomId() }}">
      <i-lucide icon [img]="classroomIcon" class="size-[28px]" />
      {{ classroomName() }}
    </gow-portal-sidebar-link>
  `,
  imports: [PortalSidebarLinkComponent, LucideAngularModule]
})
export class ClassroomSidebarLinkComponent {
  public readonly classroomIcon = Presentation

  public schoolId = input.required<string>({ alias: 'schoolId' })
  public classroomId = input.required<string>({ alias: 'classroomId' })
  public classroomName = input.required<string>({ alias: 'classroomName' })
}
