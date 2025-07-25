import { Component, inject, OnInit, signal } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { AtSign, LucideAngularModule, Phone } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { CardModule } from 'primeng/card'
import { SelectModule } from 'primeng/select'
import { TagModule } from 'primeng/tag'
import { Toast } from 'primeng/toast'
import { ClassroomAdminPanelLoadingComponent } from '~/classrooms/components/ui/classroom-admin-panel-loading.component'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { PageHeaderComponent } from '~/shared/components/ui/page-header/page-header.component'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { DefaultSchoolStore } from '~/shared/store/default-school.store'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import { StudentProfileModel } from '~/student-profiles/models/StudentProfile.model'
import { StudentProfileService } from '~/student-profiles/services/student-profile/student-profile.service'

interface DropdownOption {
  label: string
  value: string
}

const studentInformationErrorMessages: ErrorMessages = {
  ...commonErrorMessages
}

@Component({
  selector: 'gow-classroom-admin-panel-student-details',
  templateUrl: './classroom-admin-panel-student-details.component.html',
  imports: [
    ReactiveFormsModule,
    ClassroomAdminPanelLoadingComponent,
    Toast,
    CardModule,
    SelectModule,
    PageHeaderComponent,
    TagModule,
    LucideAngularModule
  ],
  providers: [MessageService]
})
export class ClassroomAdminPanelStudentDetailsPageComponent implements OnInit {
  public readonly phoneIcon = Phone
  public readonly emailIcon = AtSign

  private readonly studentProfileService = inject(StudentProfileService)

  public readonly defaultSchoolStore = inject(DefaultSchoolStore)
  public readonly context = inject(ClassroomAdminPanelContextService)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly toastService = inject(MessageService)

  public studentInformation = signal<StudentProfileModel | null>(null)
  public isStudentInformationLoading = signal<boolean>(false)

  selectedPeriod = 'current'
  selectedMaestryTime = 'today'
  selectedSkillsTime = 'today'

  periodOptions: DropdownOption[] = [
    { label: '26 Diciembre del 2025 - Actualidad', value: 'current' },
    { label: 'Períodos anteriores', value: 'previous' }
  ]

  timeOptions: DropdownOption[] = [
    { label: 'Hoy', value: 'today' },
    { label: 'Esta semana', value: 'week' },
    { label: 'Este mes', value: 'month' }
  ]

  ngOnInit(): void {
    const studentProfileId =
      this.activatedRoute.snapshot.paramMap.get('studentId')

    if (studentProfileId === null) return

    this.loadStudentInformation(studentProfileId)
  }

  private loadStudentInformation(studentProfileId: string) {
    this.isStudentInformationLoading.set(true)

    this.studentProfileService
      .getStudentProfileByIdAsync(studentProfileId)
      .then(studentProfile => {
        this.studentInformation.set(studentProfile)
        this.isStudentInformationLoading.set(false)
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.onShowStudentInformationLoadingErrorMessage(error.code)
      })
  }

  private onShowStudentInformationLoadingErrorMessage(code: string) {
    const { summary, message } = studentInformationErrorMessages[code]
    this.toastService.add({ severity: 'error', summary, detail: message })
  }
}
