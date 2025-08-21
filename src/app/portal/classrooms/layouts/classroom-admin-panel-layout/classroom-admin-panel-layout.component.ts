import { Component, inject, OnInit, signal } from '@angular/core'
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet
} from '@angular/router'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import {
  ArrowUpRight,
  Ellipsis,
  Files,
  GraduationCap,
  LucideAngularModule,
  LucideIconData,
  Presentation,
  Shapes,
  Sparkles,
  TriangleAlert,
  Users
} from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { SkeletonModule } from 'primeng/skeleton'
import { TabsModule } from 'primeng/tabs'
import { Toast } from 'primeng/toast'
import { ClassroomAdminPanelLoadingComponent } from '~/classrooms/components/ui/classroom-admin-panel-loading.component'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { ClassroomsService } from '~/classrooms/services/classrooms/classrooms.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'

@Component({
  selector: 'gow-classroom-admin-panel-layout',
  templateUrl: 'classroom-admin-panel-layout.component.html',
  imports: [
    SkeletonModule,
    TabsModule,
    Toast,
    LucideAngularModule,
    RouterOutlet,
    RouterLink,
    ClassroomAdminPanelLoadingComponent
  ],
  providers: [MessageService]
})
export class ClassroomAdminPanelLayoutComponent implements OnInit {
  public readonly classroomIcon = Presentation
  public readonly optionsIcon = Ellipsis

  public readonly classroomService = inject(ClassroomsService)

  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly toastService = inject(MessageService)
  public readonly context = inject(ClassroomAdminPanelContextService)

  public isClassroomLoading = signal<boolean>(false)

  public readonly navigationTabs: Array<{
    route: string
    label: string
    icon: LucideIconData
  }> = [
    {
      route: 'overview',
      label: 'Clase',
      icon: Shapes
    },
    {
      route: 'students',
      label: 'Estudiantes',
      icon: GraduationCap
    },
    {
      route: 'abilities',
      label: 'Habilidades',
      icon: Sparkles
    },
    {
      route: 'teams',
      label: 'Equipos y personajes',
      icon: Users
    },
    {
      route: 'homeworks',
      label: 'Tareas',
      icon: Files
    },
    {
      route: 'levels',
      label: 'Niveles',
      icon: ArrowUpRight
    },
    {
      route: 'penalties',
      label: 'Penalizaciones',
      icon: TriangleAlert
    }
  ]

  public activeTab = signal<string>('')

  ngOnInit(): void {
    this.loadClassroom()
    this.syncActiveTab()
  }

  private loadClassroom() {
    this.isClassroomLoading.set(true)

    const classroomId = this.activatedRoute.snapshot.paramMap.get('classroomId')

    if (classroomId === null) {
      this.onShowErrorMessage(
        'Aula no encontrada',
        'No se puedo obtener información del aula'
      )
      return
    }

    this.classroomService
      .getClassroomByIdAsync(classroomId)
      .then(classroom => {
        this.context.classroom.set(classroom)
        this.isClassroomLoading.set(false)
      })
      .catch(err => {
        const error = err as ErrorResponse
        const { summary, message } = commonErrorMessages[error.code]
        this.onShowErrorMessage(summary, message)
      })
  }

  private syncActiveTab() {
    const activeTabName = this.router.url.replace('/', '').split('/')[5]
    this.activeTab.set(activeTabName)
  }

  private onShowErrorMessage(summary: string, message: string) {
    this.toastService.add({ summary, detail: message, severity: 'error' })
  }
}
