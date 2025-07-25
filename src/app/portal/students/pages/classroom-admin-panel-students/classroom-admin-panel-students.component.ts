import { Component, inject, OnInit, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { LucideAngularModule, Plus, Trash2 } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { TableModule } from 'primeng/table'
import { Toast } from 'primeng/toast'
import { ClassroomAdminPanelLoadingComponent } from '~/classrooms/components/ui/classroom-admin-panel-loading.component'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import { StudentProfileModel } from '~/student-profiles/models/StudentProfile.model'
import { StudentProfileService } from '~/student-profiles/services/student-profile/student-profile.service'

const studentProfilesErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

@Component({
  selector: 'gow-classroom-admin-panel-students',
  templateUrl: './classroom-admin-panel-students.component.html',
  imports: [
    ClassroomAdminPanelLoadingComponent,
    Toast,
    TableModule,
    ButtonModule,
    RouterLink,
    LucideAngularModule
  ],
  providers: [MessageService]
})
export class ClassroomAdminPanelStudentsPageComponent implements OnInit {
  public readonly addIcon = Plus
  public readonly deleteIcon = Trash2

  private readonly studentProfileService = inject(StudentProfileService)

  private readonly toastService = inject(MessageService)
  private readonly context = inject(ClassroomAdminPanelContextService)

  public studentProfiles = signal<StudentProfileModel[]>([])
  public isStudentsLoading = signal<boolean>(false)

  ngOnInit(): void {
    this.loadStudents()
  }

  private loadStudents() {
    const classroomId = this.context.classroom()?.id ?? null

    if (classroomId === null) return

    this.isStudentsLoading.set(true)

    this.studentProfileService
      .getAllStudentProfilesByClassroomId(classroomId)
      .subscribe({
        next: studentProfiles => {
          this.studentProfiles.set(studentProfiles)
          this.isStudentsLoading.set(false)
        },
        error: err => {
          const error = err as ErrorResponse
          this.onShowStudentProfilesLoadingErrorMessage(error.code)
        }
      })
  }

  private onShowStudentProfilesLoadingErrorMessage(code: string) {
    const { summary, message } = studentProfilesErrorMessages[code]
    this.toastService.add({ severity: 'error', detail: message, summary })
  }
}
