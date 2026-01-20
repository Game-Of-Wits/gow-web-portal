import { Component, effect, inject, input, output, signal } from '@angular/core'
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { Circle, CircleCheckBig, LucideAngularModule, X } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { Toast } from 'primeng/toast'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { TextFieldComponent } from '~/shared/components/ui/text-field/text-field.component'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import { editStudentProfileForm } from '~/student-profiles/forms'
import { EditStudentProfileForm } from '~/student-profiles/models/EditStudentProfileForm.model'
import { StudentProfileModel } from '~/student-profiles/models/StudentProfile.model'
import { StudentProfileService } from '~/student-profiles/services/student-profile/student-profile.service'

const editStudentProfileErrorMessages: ErrorMessages = {
  'student-profile-not-exist': {
    summary: 'Perfil de estudiante no encontrado',
    message: 'No se ha encontrado el perfil del estudiante'
  },
  'phone-number-is-using': {
    summary: 'El número telefónico ya esta en uso',
    message:
      'El nuevo número telefónico del estudiante ya esta en uso por otro estudiante'
  },
  ...commonErrorMessages
}

@Component({
  selector: 'gow-edit-student-profile-form-dialog',
  templateUrl: './edit-student-profile-form-dialog.component.html',
  imports: [
    Toast,
    TextFieldComponent,
    ButtonModule,
    DialogModule,
    LucideAngularModule,
    ReactiveFormsModule
  ],
  providers: [MessageService]
})
export class EditStudentProfileFormDialogComponent {
  public readonly closeIcon = X
  public readonly isNoValidIcon = Circle
  public readonly isValidIcon = CircleCheckBig

  private readonly studentProfileService = inject(StudentProfileService)

  private readonly classroomContext = inject(ClassroomAdminPanelContextService)
  private readonly toastService = inject(MessageService)

  public studentProfile = input<StudentProfileModel | null>(null)

  public isLoading = signal<boolean>(false)

  public studentProfileEditForm: FormGroup<EditStudentProfileForm> =
    editStudentProfileForm()

  public onClose = output<void>({ alias: 'close' })
  public onSuccess = output<StudentProfileModel>({
    alias: 'success'
  })

  constructor() {
    effect(() => {
      const studentProfile = this.studentProfile()

      if (studentProfile !== null) {
        this.studentProfileEditForm = editStudentProfileForm({
          firstName: studentProfile.firstName,
          lastName: studentProfile.lastName,
          phoneNumber: studentProfile.phoneNumber
        })
      } else {
        this.studentProfileEditForm = editStudentProfileForm()
      }
    })
  }

  public onCloseDialog() {
    this.studentProfileEditForm = editStudentProfileForm()
    this.onClose.emit()
    this.isLoading.set(false)
  }

  public hasErrorValidation(
    control: AbstractControl | null,
    validationKey: string
  ) {
    if (control === null) return false
    return control?.pristine || control?.hasError(validationKey)
  }

  public onEdit() {
    const classroomId = this.classroomContext.classroom()?.id ?? null
    const studentProfile = this.studentProfile()

    if (
      classroomId === null ||
      studentProfile === null ||
      this.studentProfileEditForm.invalid
    )
      return

    this.isLoading.set(true)

    const editFormData = this.studentProfileEditForm.getRawValue()

    this.studentProfileService
      .editStudentProfile(studentProfile.id, {
        ...editFormData,
        classroomId
      })
      .then(studentProfile => {
        this.onSuccess.emit(studentProfile)
        this.onCloseDialog()
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showEditStudentProfileErrorMessage(error.code)
        this.isLoading.set(false)
      })
  }

  get firstNameControl(): AbstractControl<string> {
    return this.studentProfileEditForm.get(
      'firstName'
    ) as AbstractControl<string>
  }

  get lastNameControl(): AbstractControl<string> {
    return this.studentProfileEditForm.get(
      'lastName'
    ) as AbstractControl<string>
  }

  get phoneNumberControl(): AbstractControl<string> {
    return this.studentProfileEditForm.get(
      'phoneNumber'
    ) as AbstractControl<string>
  }

  private showEditStudentProfileErrorMessage(code: string) {
    const { summary, message } = editStudentProfileErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showErrorMessage(summary: string, detail: string) {
    this.toastService.add({ severity: 'error', summary, detail })
  }
}
