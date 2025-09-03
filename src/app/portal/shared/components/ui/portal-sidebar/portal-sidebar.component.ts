import { Component, computed, inject, OnInit, signal } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import {
  House,
  LucideAngularModule,
  Plus,
  School,
  SquareDashed
} from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { MessageModule } from 'primeng/message'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { ClassroomSidebarLinkComponent } from '~/classrooms/components/ui/classroom-sidebar-link/classroom-sidebar-link.component'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { ClassroomModel } from '~/classrooms/models/Classroom.model'
import { ClassroomsService } from '~/classrooms/services/classrooms/classrooms.service'
import { GeneralPanelContextService } from '~/shared/contexts/general-panel-context/general-panel-context.service'
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
    ButtonModule,
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
  public readonly generalIcon = House
  public readonly classroomsIcon = School
  public readonly addClassroomIcon = Plus
  public readonly emptyIcon = SquareDashed

  public readonly classroomService = inject(ClassroomsService)
  public readonly sidebarStore = inject(SidebarStateStore)
  public readonly localStorage = inject(LocalStorageService)
  public readonly defaultSchoolStore = inject(DefaultSchoolStore)
  public readonly toastService = inject(MessageService)

  private readonly generalContext = inject(GeneralPanelContextService)
  private readonly classroomContext = inject(ClassroomAdminPanelContextService)

  public classrooms = signal<ClassroomModel[]>([])

  public isClassroomsLoading = signal<boolean>(false)

  public hasActiveAcademicPeriod = computed(() => {
    return (
      this.generalContext.activeAcademicPeriod() !== null ||
      this.classroomContext.activeAcademicPeriod() !== null
    )
  })

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
