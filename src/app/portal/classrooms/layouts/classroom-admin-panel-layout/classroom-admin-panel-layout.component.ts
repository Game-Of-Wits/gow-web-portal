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
import { AcademicPeriodService } from '~/academic-periods/services/academic-period/academic-period.service'
import { ClassroomAdminPanelLoadingComponent } from '~/classrooms/components/ui/classroom-admin-panel-loading.component'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { ClassroomsService } from '~/classrooms/services/classrooms/classrooms.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { DefaultSchoolStore } from '~/shared/store/default-school.store'

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
  private readonly academicPeriodService = inject(AcademicPeriodService)

  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly toastService = inject(MessageService)
  private readonly defaultSchoolStore = inject(DefaultSchoolStore)
  public readonly classroomContext = inject(ClassroomAdminPanelContextService)

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

    if (classroomId === null) return

    this.classroomService
      .getClassroomByIdAsync(classroomId)
      .then(classroom => {
        this.classroomContext.classroom.set(classroom)

        const schoolId = this.defaultSchoolStore.school()?.id

        if (schoolId === undefined) return

        this.academicPeriodService
          .getSchoolActiveAcademicPeriod(schoolId)
          .subscribe({
            next: academicPeriod => {
              this.classroomContext.activeAcademicPeriod.set(academicPeriod)
            },
            complete: () => {
              this.isClassroomLoading.set(false)
            },
            error: err => {
              const error = err as ErrorResponse
              if (error.code === 'active-academic-period-not-exist') {
                this.isClassroomLoading.set(false)
                return
              }
            }
          })
      })
      .catch(err => {
        const error = err as ErrorResponse
        const { summary, message } = commonErrorMessages[error.code]
        this.showErrorMessage(summary, message)
      })
  }

  private syncActiveTab() {
    const activeTabName = this.router.url.replace('/', '').split('/')[5]
    this.activeTab.set(activeTabName)
  }

  private showErrorMessage(summary: string, message: string) {
    this.toastService.add({ summary, detail: message, severity: 'error' })
  }
}
