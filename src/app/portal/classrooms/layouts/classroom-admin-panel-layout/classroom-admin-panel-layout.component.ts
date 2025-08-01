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
import { EducationalExperience } from '~/shared/models/EducationalExperience'
import { gowThemeConfig } from '~/shared/theme'

const activeTabColors: Record<
  EducationalExperience | 'GENERAL',
  {
    textColor: string
    borderColor: string
  }
> = {
  [EducationalExperience.MASTERY_ROAD]: {
    borderColor: gowThemeConfig.semantic.info[500],
    textColor: gowThemeConfig.semantic.info[500]
  },
  [EducationalExperience.SHADOW_WARFARE]: {
    borderColor: gowThemeConfig.semantic.danger[500],
    textColor: gowThemeConfig.semantic.danger[500]
  },
  GENERAL: {
    borderColor: gowThemeConfig.semantic.primary[500],
    textColor: gowThemeConfig.semantic.primary[500]
  }
}

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
    activeColor: {
      textColor: string
      borderColor: string
    }
  }> = [
    {
      route: 'overview',
      label: 'Clase',
      icon: Shapes,
      activeColor: activeTabColors['GENERAL']
    },
    {
      route: 'students',
      label: 'Estudiantes',
      icon: GraduationCap,
      activeColor: activeTabColors['GENERAL']
    },
    {
      route: 'abilities',
      label: 'Habilidades',
      icon: Sparkles,
      activeColor: activeTabColors['GENERAL']
    },
    {
      route: 'teams',
      label: 'Equipos y personajes',
      icon: Users,
      activeColor: activeTabColors[EducationalExperience.SHADOW_WARFARE]
    },
    {
      route: 'homeworks',
      label: 'Tareas',
      icon: Files,
      activeColor: activeTabColors[EducationalExperience.SHADOW_WARFARE]
    },
    {
      route: 'levels',
      label: 'Niveles',
      icon: ArrowUpRight,
      activeColor: activeTabColors[EducationalExperience.MASTERY_ROAD]
    },
    {
      route: 'penalties',
      label: 'Penalizaciones',
      icon: TriangleAlert,
      activeColor: activeTabColors[EducationalExperience.MASTERY_ROAD]
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

    this.classroomService.getClassroomById(classroomId).subscribe({
      next: classroom => {
        this.context.classroom.set(classroom)
        this.isClassroomLoading.set(false)
      },
      error: err => {
        const error = err as ErrorResponse
        const { summary, message } = commonErrorMessages[error.code]
        this.onShowErrorMessage(summary, message)
      }
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
