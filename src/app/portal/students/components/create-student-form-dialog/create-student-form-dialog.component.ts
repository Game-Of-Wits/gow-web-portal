import { Component, inject, input, OnInit, output, signal } from '@angular/core'
import { AbstractControl, ReactiveFormsModule } from '@angular/forms'
import {
  Circle,
  CircleCheckBig,
  LucideAngularModule,
  Square,
  X
} from 'lucide-angular'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { AcademicPeriodService } from '~/academic-periods/services/academic-period/academic-period.service'
import { CharacterModel } from '~/characters/models/Character.model'
import { CharacterService } from '~/characters/services/character/character.service'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { TextFieldComponent } from '~/shared/components/ui/text-field/text-field.component'
import { DefaultSchoolStore } from '~/shared/store/default-school.store'
import { SelectOption } from '~/shared/types/SelectOption'
import { createStudentForm } from '~/students/forms/createStudentForm'
import { StudentModel } from '~/students/models/Student.model'

@Component({
  selector: 'gow-create-student-form-dialog',
  templateUrl: 'create-student-form-dialog.component.html',
  imports: [
    TextFieldComponent,
    ButtonModule,
    DialogModule,
    LucideAngularModule,
    SelectFieldComponent,
    ReactiveFormsModule
  ]
})
export class CreateStudentFormDialogComponent implements OnInit {
  public readonly closeIcon = X
  public readonly isNoValidIcon = Circle
  public readonly isValidIcon = CircleCheckBig

  private readonly academicPeriodService = inject(AcademicPeriodService)
  private readonly characterService = inject(CharacterService)

  private readonly defaultSchoolStore = inject(DefaultSchoolStore)

  public showDialog = input.required<boolean>({ alias: 'show' })
  public classroomId = input.required<string>({ alias: 'classroomId' })

  public characterOptions = signal<SelectOption[]>([])
  public isAcademicPeriodActive = signal<boolean>(false)
  public isCreatingStudentLoading = signal<boolean>(false)

  public createStudentForm = createStudentForm()

  public onClose = output<void>({ alias: 'close' })
  public onSuccess = output<{ student: StudentModel }>({ alias: 'success' })

  ngOnInit(): void {
    this.verifyAcademicPeriodIsActive()
  }

  public onCreateStudent() {
    const createStudentData = this.createStudentForm.getRawValue()
    console.log(createStudentData)
  }

  public onCloseDialog() {
    this.onClose.emit()
    this.createStudentForm = createStudentForm()
  }

  public hasErrorValidation(
    control: AbstractControl | null,
    validationKey: string
  ) {
    return control?.pristine || control?.hasError(validationKey)
  }

  public invalidPasswordValidation(validationKey: string) {
    return (
      this.passwordControl.pristine ||
      this.passwordControl.value === '' ||
      this.passwordControl.hasError(validationKey)
    )
  }

  private async verifyAcademicPeriodIsActive() {
    const schoolId = this.defaultSchoolStore.school()?.id ?? null

    if (schoolId === null) return

    this.academicPeriodService
      .verifySchoolHasActiveAcademicPeriod(schoolId)
      .then(isActive => {
        if (!isActive) return

        this.isAcademicPeriodActive.set(true)
        this.createStudentForm.get('character')?.setValue('')
        this.loadCharacters()
      })
      .catch(() => {})
  }

  private loadCharacters() {
    this.characterService
      .getAllCharactersByClassroom(this.classroomId())
      .subscribe({
        next: characters => {
          this.characterOptions.set(
            characters.map(character => ({
              name: character.name,
              code: character.id
            }))
          )
        },
        error: () => {}
      })
  }

  get firstNameControl(): AbstractControl<string> {
    return this.createStudentForm.get('firstName') as AbstractControl<string>
  }

  get lastNameControl(): AbstractControl<string> {
    return this.createStudentForm.get('lastName') as AbstractControl<string>
  }

  get phoneNumberControl(): AbstractControl<string> {
    return this.createStudentForm.get('phoneNumber') as AbstractControl<string>
  }

  get characterControl(): AbstractControl<string> {
    return this.createStudentForm.get('character') as AbstractControl<string>
  }

  get emailControl(): AbstractControl<string> {
    return this.createStudentForm.get('email') as AbstractControl<string>
  }

  get passwordControl(): AbstractControl<string> {
    return this.createStudentForm.get('password') as AbstractControl<string>
  }
}
