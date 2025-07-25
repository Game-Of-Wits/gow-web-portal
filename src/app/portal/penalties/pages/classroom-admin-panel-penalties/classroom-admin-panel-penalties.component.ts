import { Component, inject, signal } from '@angular/core'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { LucideAngularModule, Pencil, Plus, Trash2 } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { TableModule } from 'primeng/table'
import { Toast } from 'primeng/toast'
import { ClassroomAdminPanelLoadingComponent } from '~/classrooms/components/ui/classroom-admin-panel-loading.component'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { PenaltyModel } from '~/penalties/models/Penalty.model'
import { PenaltyService } from '~/penalties/services/penalty/penalty.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { ErrorMessages } from '~/shared/types/ErrorMessages'

const penaltiesErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

@Component({
  selector: 'gow-classroom-admin-panel-penalties',
  templateUrl: './classroom-admin-panel-penalties.component.html',
  imports: [
    ClassroomAdminPanelLoadingComponent,
    Toast,
    TableModule,
    ButtonModule,
    LucideAngularModule
  ],
  providers: [MessageService]
})
export class ClassroomAdminPanelPenaltiesPageComponent {
  public readonly addIcon = Plus
  public readonly deleteIcon = Trash2
  public readonly editIcon = Pencil

  private readonly penaltiesService = inject(PenaltyService)

  private readonly toastService = inject(MessageService)
  private readonly context = inject(ClassroomAdminPanelContextService)

  public penalties = signal<PenaltyModel[]>([])
  public isPenaltiesLoading = signal<boolean>(false)

  ngOnInit(): void {
    this.loadStudents()
  }

  private loadStudents() {
    const classroomId = this.context.classroom()?.id ?? null

    if (classroomId === null) return

    this.isPenaltiesLoading.set(true)

    this.penaltiesService.getAllPenaltiesByClassroom(classroomId).subscribe({
      next: penalties => {
        this.penalties.set(penalties)
        this.isPenaltiesLoading.set(false)
      },
      error: err => {
        const error = err as ErrorResponse
        this.onShowPenaltiesLoadingErrorMessage(error.code)
      }
    })
  }

  private onShowPenaltiesLoadingErrorMessage(code: string) {
    const { summary, message } = penaltiesErrorMessages[code]
    this.toastService.add({ severity: 'error', detail: message, summary })
  }
}
