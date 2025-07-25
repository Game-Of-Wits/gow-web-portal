import { Component, inject, OnInit, signal } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { House, LucideAngularModule, Plus, School } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { MessageModule } from 'primeng/message'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { ClassroomSidebarLinkComponent } from '~/classrooms/components/ui/classroom-sidebar-link/classroom-sidebar-link.component'
import { ClassroomModel } from '~/classrooms/models/Classroom.model'
import { ClassroomsService } from '~/classrooms/services/classrooms/classrooms.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { LocalStorageService } from '~/shared/services/local-storage.service'
import { DefaultSchoolStore } from '~/shared/store/default-school.store'
import { SidebarStateStore } from '~/shared/store/sidebar.store'
import { PortalSidebarLinkComponent } from './ui/portal-sidebar-link.component'
import { PortalSidebarPaperComponent } from './ui/portal-sidebar-paper.component'

@Component({
  selector: 'gow-portal-sidebar',
  templateUrl: './portal-sidebar.component.html',
  styles: `
    .add-classroom-link-active {
      background-color: var(--p-primary-500);
      color: white;
    }
  `,
  imports: [
    RouterLink,
    RouterLinkActive,
    PortalSidebarLinkComponent,
    PortalSidebarPaperComponent,
    ClassroomSidebarLinkComponent,
    MessageModule,
    ProgressSpinnerModule,
    LucideAngularModule
  ],
  providers: [MessageService]
})
export class PortalSidebarComponent implements OnInit {
  public readonly classroomService = inject(ClassroomsService)
  public readonly sidebarStore = inject(SidebarStateStore)
  public readonly localStorage = inject(LocalStorageService)
  public readonly defaultSchoolStore = inject(DefaultSchoolStore)
  public readonly toastService = inject(MessageService)

  public readonly generalIcon = House
  public readonly classroomsIcon = School
  public readonly addClassroomIcon = Plus

  public classrooms = signal<ClassroomModel[]>([])

  public isClassroomsLoading = signal<boolean>(false)

  ngOnInit(): void {
    this.loadClassrooms()
  }

  private loadClassrooms() {
    this.isClassroomsLoading.set(true)
    this.classroomService.getAllClassrooms().subscribe({
      next: classrooms => {
        this.classrooms.set(classrooms)
        this.isClassroomsLoading.set(false)
      },
      error: err => {
        const error = err as ErrorResponse
        this.onShowErrorMessage(error.code)
      }
    })
  }

  private onShowErrorMessage(code: string) {
    const { summary, message } = commonErrorMessages[code]
    this.toastService.add({ summary, detail: message, severity: 'error' })
  }
}
