import { NgOptimizedImage } from '@angular/common'
import { Component, inject, output, signal } from '@angular/core'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { LucideAngularModule, Timer } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { Toast } from 'primeng/toast'
import { ClassSessionService } from '~/class-sessions/services/class-session/class-session.service'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { ErrorMessages } from '~/shared/types/ErrorMessages'

const startClassSessionErrorMessages: ErrorMessages = {
  'academic-period-not-active': {
    summary: 'Periodo académico no activo',
    message: 'El periodo académico de esta escuela aún no ha sido inicializado'
  },
  'classroom-not-exist': {
    summary: 'Aula no existente',
    message: 'El aula no ha posido ser encontrada en los registros'
  },
  'active-class-session-exist': {
    summary: 'Sesión de clase activa',
    message: 'Se ha encontrado una sesión de clase ya inicializada'
  },
  'classroom-not-owned': {
    summary: 'Sin acceso al aula',
    message: 'No tiene usted permiso de interactuar con esta aula'
  },
  ...commonErrorMessages
}

@Component({
  selector: 'gow-start-class-session-panel',
  template: `
    <section class="flex justify-center mt-[170px]">
      <div class="flex flex-col items-center">
        <img
          ngSrc="/assets/images/teacher-starting-class-session.png"
          priority
          class="size-[200px] mb-4.5"
          width="600"
          height="600"
        />

        <h1 class="text-4xl font-bold mb-3">!Empecemos la clase!</h1>

        <button
          class="flex items-center transition-colors gap-1.5 cursor-pointer group"
          [disabled]="startClassSessionLoading()"
          (click)="onStartClassSession()"
        >
          <div
            class="group-hover:bg-primary-600 transition-colors size-[40px] rounded-full flex items-center justify-center bg-primary-500 text-white relative"
          >
            @if (!startClassSessionLoading()) {
              <i-lucide
                [img]="startClassSessionIcon"
                class="size-6 leading-none"
              />
            } @else {
              <p-progress-spinner
                ariaLabel="loading"
                strokeWidth="4"
                [style]="{
                  width: '24px',
                  height: '24px',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }"
              ></p-progress-spinner>
            }
          </div>
          <span
            class="group-hover:text-primary-600 transition-colors text-primary-500 text-xl font-bold"
          >
            Empezar clase
          </span>
        </button>
      </div>
    </section>

    <p-toast position="bottom-center" />
  `,
  imports: [
    NgOptimizedImage,
    ProgressSpinnerModule,
    Toast,
    LucideAngularModule
  ],
  providers: [MessageService]
})
export class StartClassSessionPanelComponent {
  public readonly startClassSessionIcon = Timer

  private readonly classSessionService = inject(ClassSessionService)

  private readonly classroomContext = inject(ClassroomAdminPanelContextService)
  private readonly toastService = inject(MessageService)

  public startClassSessionLoading = signal<boolean>(false)

  public onLoading = output<boolean>({ alias: 'loading' })

  public async onStartClassSession() {
    const classroomId = this.classroomContext.classroom()?.id ?? null
    const activeAcademicPeriodId =
      this.classroomContext.activeAcademicPeriod()?.id ?? null

    if (classroomId === null || activeAcademicPeriodId === null) return

    this.startClassSessionLoading.set(true)

    try {
      const classSession = await this.classSessionService.startNewClassSession({
        academicPeriodId: activeAcademicPeriodId,
        classroomId: classroomId
      })
      this.onLoading.emit(true)
      this.classroomContext.classSession.set(classSession)
    } catch (err) {
      const error = err as ErrorResponse
      this.onShowErrorMessage(error.code)
    } finally {
      this.startClassSessionLoading.set(false)
      this.onLoading.emit(false)
    }
  }

  private onShowErrorMessage(code: string) {
    const { summary, message } = startClassSessionErrorMessages[code]
    this.toastService.add({ summary, detail: message, severity: 'error' })
  }
}
