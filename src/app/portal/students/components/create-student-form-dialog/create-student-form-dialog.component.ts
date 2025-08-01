import { Component, inject, input, OnInit, output } from '@angular/core'
import { LucideAngularModule, X } from 'lucide-angular'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { AcademicPeriodService } from '~/academic-periods/services/academic-period/academic-period.service'
import { TextFieldComponent } from '~/shared/components/ui/text-field/text-field.component'
import { DefaultSchoolStore } from '~/shared/store/default-school.store'
import { StudentModel } from '~/students/models/Student.model'

@Component({
  selector: 'gow-create-student-form-dialog',
  templateUrl: 'create-student-form-dialog.component.html',
  imports: [TextFieldComponent, ButtonModule, DialogModule, LucideAngularModule]
})
export class CreateStudentFormDialogComponent implements OnInit {
  public readonly closeIcon = X

  private readonly academicPeriodService = inject(AcademicPeriodService)

  private readonly defaultSchoolStore = inject(DefaultSchoolStore)

  public showDialog = input.required<boolean>({ alias: 'show' })
  public classroomId = input.required<string>({ alias: 'classroomId' })

  public onClose = output<void>({ alias: 'close' })
  public onSuccess = output<{ student: StudentModel }>({ alias: 'success' })

  ngOnInit(): void {}

  public onCloseDialog() {
    this.onClose.emit()
  }

  private verifyAcademicPeriodIsActive() {
    const schoolId = this.defaultSchoolStore.school()?.id ?? null

    if (schoolId === null) return
  }
}
