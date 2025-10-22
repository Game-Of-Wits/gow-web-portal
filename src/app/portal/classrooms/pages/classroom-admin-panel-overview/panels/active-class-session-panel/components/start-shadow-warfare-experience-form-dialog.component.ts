import {
  Component,
  HostListener,
  inject,
  input,
  output,
  signal
} from '@angular/core'
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { LucideAngularModule, X } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { ExperienceSessionService } from '~/class-sessions/services/experience-session/experience-session.service'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { SelectFieldComponent } from '~/shared/components/ui/select-field/select-field.component'
import { classShiftOptions } from '~/shared/data/classShiftOptions'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { ClassShift } from '~/shared/models/ClassShift'
import { EducationalExperience } from '~/shared/models/EducationalExperience'

const startShadowWarfareExperienceErrorMessages = {
  ...commonErrorMessages
}

@Component({
  selector: 'gow-start-shadow-warfare-experience-form-dialog',
  template: `
  <p-dialog
    [modal]="true"
    [visible]="showDialog()"
    [draggable]="false"
    [resizable]="false"
    [closable]="false"
    [style]="{
      'max-width': '550px',
      width: '100%',
    }"
  >
    <ng-template #header>
      <div class="flex justify-between items-center w-full">
        <span class="font-bold text-xl">Iniciar la experiencia "Guerra de Sombras"</span>

        <button
          class="size-[40px] flex items-center justify-center rounded-full bg-transparent hover:bg-gray-50 cursor-pointer group disabled:cursor-not-allowed"
          type="button"
          (click)="onCloseDialog()"
          [disabled]="isLoading()"
        >
          <i-lucide [img]="closeIcon" class="size-[20px] text-gray-700 group-disabled:text-gray-300" />
        </button>
      </div>
    </ng-template>

    <div class="flex flex-col gap-[30px]">
      <div class="flex flex-col gap-1">
        <gow-select-field
          label="Horario"
          placeholder="Selecciona el horaro de la sesión"
          focusColor="danger"
          [options]="classShiftOptions"
          [formControl]="experienceShiftControl"
          [enableClear]="false"
          [scrollHeight]="80"
        />

        @if (experienceShiftControl.invalid && experienceShiftControl.touched) {
          @if (hasErrorValidation(experienceShiftControl, "required")) {
            <p class="text-sm text-danger-500">Es requerido</p>
          }
        }
      </div>

      <p-button
        styleClass="w-full rounded-xl py-3"
        severity="danger"
        label="Empezar experiencia"
        (click)="onStartShadowWarfareExperience()"
        [disabled]="experienceShiftControl.invalid"
        [loading]="isLoading()"
      />
    </div>
  </p-dialog>
  `,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    LucideAngularModule,
    ButtonModule,
    SelectFieldComponent
  ],
  providers: [MessageService]
})
export class StartShadowWarfareExperienceFormDialog {
  public readonly closeIcon = X
  public readonly classShiftOptions = classShiftOptions

  private readonly experienceService = inject(ExperienceSessionService)

  private readonly classroomContext = inject(ClassroomAdminPanelContextService)
  private readonly toastService = inject(MessageService)

  public showDialog = input.required<boolean>({ alias: 'show' })

  public experienceShiftControl = new FormControl<ClassShift>(
    ClassShift.AFTERNOON,
    {
      nonNullable: true,
      validators: [Validators.required]
    }
  )

  public onClose = output<void>({ alias: 'close' })

  public isLoading = signal<boolean>(false)

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.onCloseDialog()
  }

  public onStartShadowWarfareExperience() {
    const activeClassSession = this.classroomContext.classSession()
    const classShift = this.experienceShiftControl.getRawValue()

    if (activeClassSession === null || this.experienceShiftControl.invalid)
      return

    this.isLoading.set(true)

    this.experienceService
      .startNewExperienceSession({
        classSessionId: activeClassSession.id,
        experience: EducationalExperience.SHADOW_WARFARE,
        rules: {
          shift: classShift
        }
      })
      .then(experienceSession => {
        this.classroomContext.experienceSession.set(experienceSession)
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.onShowErrorMessage(error.code)
      })
      .finally(() => {
        this.isLoading.set(false)
      })
  }

  public onCloseDialog() {
    this.onClose.emit()
    this.experienceShiftControl.reset(ClassShift.AFTERNOON)
  }

  public hasErrorValidation(
    control: AbstractControl | null,
    validationKey: string
  ) {
    return control?.pristine || control?.hasError(validationKey)
  }

  private onShowErrorMessage(code: string) {
    const { summary, message } = startShadowWarfareExperienceErrorMessages[code]
    this.toastService.add({ severity: 'error', summary, detail: message })
  }
}
