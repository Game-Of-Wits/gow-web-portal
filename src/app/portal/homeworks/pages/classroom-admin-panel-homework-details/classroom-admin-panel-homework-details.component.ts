import { Component, inject, OnInit, signal } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import {
  Circle,
  CircleCheckBig,
  LucideAngularModule,
  Pencil,
  Trash2
} from 'lucide-angular'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { Toast } from 'primeng/toast'
import { ClassroomAdminPanelLoadingComponent } from '~/classrooms/components/ui/classroom-admin-panel-loading.component'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import {
  HomeworkFormDialogComponent,
  HomeworkFormSubmit
} from '~/homeworks/components/homework-form-dialog/homework-form-dialog.component'
import { homeworkCategoryFormats } from '~/homeworks/data/formats/homeworkCategoryFormats'
import { homeworkForm } from '~/homeworks/forms/homeworkForm'
import { AnswerOptionModel } from '~/homeworks/models/AnswerOption.model'
import { HomeworkModel } from '~/homeworks/models/Homework.model'
import { HomeworkForm } from '~/homeworks/models/HomeworkForm.model'
import { HomeworkGroupModel } from '~/homeworks/models/HomeworkGroup.model'
import { AnswerOptionService } from '~/homeworks/services/answer-option/answer-option.service'
import { HomeworkService } from '~/homeworks/services/homework/homework.service'
import { HomeworkGroupService } from '~/homeworks/services/homework-group/homework-group.service'
import { PageHeaderComponent } from '~/shared/components/ui/page-header/page-header.component'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { StorageService } from '~/shared/services/storage.service'
import { ErrorMessages } from '~/shared/types/ErrorMessages'

const updateHomeworkErrorMessages: ErrorMessages = {
  'homework-not-exist': {
    summary: 'Tarea no existente',
    message: 'La tarea no ha podido ser encontrada'
  },
  ...commonErrorMessages
}

const deleteHomeworkErrorMessages: ErrorMessages = {
  'homework-not-exist': {
    summary: 'Tarea no existente',
    message: 'La tarea no ha podido ser encontrada'
  },
  ...commonErrorMessages
}

const homeworkLoadingErrorMessages: ErrorMessages = {
  'homework-not-exist': {
    summary: 'Tarea no existente',
    message: 'La tarea no ha podido ser encontrada'
  },
  ...commonErrorMessages
}

const homeworkGroupLoadingErrorMessages: ErrorMessages = {
  'homework-group-not-exist': {
    summary: 'Grupo de tareas no existente',
    message: 'El grupo de tareas no ha podido ser encontrada'
  },
  ...commonErrorMessages
}

@Component({
  selector: 'gow-classroom-admin-panel-homework-details',
  templateUrl: './classroom-admin-panel-homework-details.component.html',
  imports: [
    PageHeaderComponent,
    ClassroomAdminPanelLoadingComponent,
    LucideAngularModule,
    ButtonModule,
    Toast,
    HomeworkFormDialogComponent,
    ConfirmDialogModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class ClassroomAdminPanelHomeworkDetailsPageComponent implements OnInit {
  public readonly checkIcon = CircleCheckBig
  public readonly noCheckIcon = Circle
  public readonly editIcon = Pencil
  public readonly deleteIcon = Trash2

  public readonly homeworkCategoryFormats = homeworkCategoryFormats

  private readonly homeworkService = inject(HomeworkService)
  private readonly homeworkGroupService = inject(HomeworkGroupService)
  private readonly answerOptionService = inject(AnswerOptionService)

  private readonly router = inject(Router)
  private readonly toastService = inject(MessageService)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly storageService = inject(StorageService)
  private readonly confirmationService = inject(ConfirmationService)
  private readonly classroomContext = inject(ClassroomAdminPanelContextService)

  public homework = signal<HomeworkModel | null>(null)
  public homeworkGroup = signal<HomeworkGroupModel | null>(null)
  public homeworkImageUrl = signal<string | null>(null)
  public homeworkAnswerOptions = signal<AnswerOptionModel[]>([])

  public isHomeworkLoading = signal<boolean>(true)
  public isHomeworkGroupLoading = signal<boolean>(true)
  public isHomeworkImageLoading = signal<boolean>(true)
  public isHomeworkAnswersLoading = signal<boolean>(true)

  public isDeletingHomeworkLoading = signal<boolean>(false)

  public showEditHomework = signal<boolean>(false)
  public editHomework = signal<{
    form: FormGroup<HomeworkForm> | null
    id: string | null
  }>({
    form: null,
    id: null
  })

  public defaultBackPath = {
    commands: ['../'],
    extras: { relativeTo: this.activatedRoute }
  }

  ngOnInit(): void {
    const homeworkId = this.activatedRoute.snapshot.paramMap.get('homeworkId')
    const homeworkGroupId =
      this.activatedRoute.parent?.snapshot.paramMap.get('homeworkGroupId') ??
      null

    if (homeworkId === null || homeworkGroupId === null) return

    this.loadHomeworkGroup(homeworkGroupId)
    this.loadHomework(homeworkId)
  }

  public onCloseEdit() {
    this.showEditHomework.set(false)
    this.editHomework.set({
      id: null,
      form: null
    })
  }

  public onOpenEditHomework() {
    const homework = this.homework()

    if (homework === null) return

    this.showEditHomework.set(true)
    this.editHomework.set({
      id: homework.id,
      form: homeworkForm({
        image: null,
        category: homework.category,
        name: homework.name,
        content: {
          correctOption: homework.content.correctOptionId,
          options: this.homeworkAnswerOptions()
        }
      })
    })
  }

  public onEditHomework(submit: HomeworkFormSubmit) {
    const homeworkId = submit.result.id
    const updateHomeworkData = submit.result.formData

    const classroom = this.classroomContext.classroom()

    if (classroom === null) return

    this.homeworkService
      .updateHomeworkById(
        {
          schoolId: classroom.schoolId,
          classroomId: classroom.id
        },
        {
          homeworkId,
          data: updateHomeworkData
        }
      )
      .then(() => {
        this.loadHomework(homeworkId)
        submit.onFinish()
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showUpdateHomeworkErrorMessage(error.code)
      })
  }

  public onDeleteHomework(event: Event) {
    const homeworkId = this.homework()?.id ?? null

    if (homeworkId === null) return

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estas seguro de eliminar la tarea?',
      header: 'Eliminar tarea',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
        loading: this.isDeletingHomeworkLoading()
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
        loading: this.isDeletingHomeworkLoading()
      },
      accept: async () => {
        this.isDeletingHomeworkLoading.set(true)

        try {
          await this.homeworkService.deleteHomeworkById(homeworkId)

          this.router.navigate(['../../'], { relativeTo: this.activatedRoute })
        } catch (err) {
          const error = err as ErrorResponse
          this.showDeleteHomeworkErrorMessage(error.code)
        } finally {
          this.isDeletingHomeworkLoading.set(false)
        }
      }
    })
  }

  private loadHomework(homeworkId: string) {
    this.homeworkService
      .getHomeworkById(homeworkId)
      .then(async homework => {
        this.homework.set(homework)
        this.isHomeworkLoading.set(false)

        Promise.allSettled([
          this.storageService.downloadUrl(homework.image),
          this.answerOptionService.getAnswerOptionsByHomeworkIdAsync(
            homework.id
          )
        ]).then(([imageResult, answerOptionResult]) => {
          if (imageResult.status === 'fulfilled') {
            this.homeworkImageUrl.set(imageResult.value)
            this.isHomeworkImageLoading.set(false)
          }

          if (answerOptionResult.status === 'fulfilled') {
            this.homeworkAnswerOptions.set(answerOptionResult.value)
            this.isHomeworkAnswersLoading.set(false)
          }
        })
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showHomeworkLoadingErrorMessage(error.code)
      })
  }

  private loadHomeworkGroup(homeworkGroupId: string) {
    this.homeworkGroupService
      .getHomeworkGroupById(homeworkGroupId)
      .then(group => {
        this.homeworkGroup.set(group)
        this.isHomeworkGroupLoading.set(false)
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showHomeworkGroupLoadingErrorMessage(error.code)
      })
  }

  private showUpdateHomeworkErrorMessage(code: string) {
    const { summary, message } = updateHomeworkErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showDeleteHomeworkErrorMessage(code: string) {
    const { summary, message } = deleteHomeworkErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showHomeworkLoadingErrorMessage(code: string) {
    const { summary, message } = homeworkLoadingErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showHomeworkGroupLoadingErrorMessage(code: string) {
    const { summary, message } = homeworkGroupLoadingErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showErrorMessage(summary: string, detail: string) {
    this.toastService.add({ severity: 'error', summary, detail })
  }
}
