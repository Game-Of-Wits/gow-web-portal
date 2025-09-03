import { Component, inject, input, OnInit, output, signal } from '@angular/core'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { LucideAngularModule, Plus } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { Toast } from 'primeng/toast'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { homeworkCategoryFormats } from '~/homeworks/data/formats/homeworkCategoryFormats'
import { HomeworkFormMapper } from '~/homeworks/mappers/homework-form.mapper'
import { HomeworkModel } from '~/homeworks/models/Homework.model'
import { HomeworkService } from '~/homeworks/services/homework/homework.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { ErrorMessages } from '~/shared/types/ErrorMessages'
import { HomeworkCardComponent } from '../homework-card/homework-card.component'
import {
  HomeworkFormDialogComponent,
  HomeworkFormSubmit
} from '../homework-form-dialog/homework-form-dialog.component'

const homeworksLoadingErrorMessages = {
  ...commonErrorMessages
}

const createHomeworkErrorMessages: ErrorMessages = {
  'correct-option-not-fount': {
    message:
      'La opción correcta selecciona no ha sido encotrada entre las opciones puestas',
    summary: 'Opción correcta no encontrada'
  },
  ...commonErrorMessages
}

@Component({
  selector: 'gow-homework-card-list',
  templateUrl: './homework-card-list.component.html',
  styles: `
    :host ::ng-deep .p-card .p-card-body {
      padding: 6px 16px;
    }
  `,
  imports: [
    Toast,
    LucideAngularModule,
    HomeworkCardComponent,
    ProgressSpinnerModule,
    HomeworkFormDialogComponent
  ],
  providers: [MessageService]
})
export class HomeworkCardListComponent implements OnInit {
  public readonly addIcon = Plus

  private readonly homeworkService = inject(HomeworkService)

  private readonly toastService = inject(MessageService)
  private readonly classroomContext = inject(ClassroomAdminPanelContextService)

  public homeworkGroupId = input.required<string>({ alias: 'homeworkGroupId' })

  public homeworks = signal<HomeworkModel[]>([])
  public isHomeworksLoading = signal<boolean>(true)

  public showCreateHomework = signal<boolean>(false)

  public onChangeHomeworksSize = output<number>({ alias: 'changeSize' })

  ngOnInit(): void {
    this.loadHomeworks()
  }

  public onOpenCreateHomework() {
    this.showCreateHomework.set(true)
  }

  public onCloseDialog() {
    this.showCreateHomework.set(false)
  }

  public onCreateHomework(submit: HomeworkFormSubmit) {
    const classroom = this.classroomContext.classroom()

    if (classroom === null) return

    const homeworkData = HomeworkFormMapper.toCreate(
      this.homeworkGroupId(),
      submit.result.formData
    )

    this.homeworkService
      .createHomework({
        schoolId: classroom.schoolId,
        classroomId: classroom.id,
        data: homeworkData
      })
      .then(homework => {
        this.homeworks.update(homeworks => [...homeworks, homework])
        this.onChangeHomeworksSize.emit(this.homeworks().length + 1)
        submit.onFinish()
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showCreateHomeworkErrorMessage(error.code)
      })
  }

  private loadHomeworks() {
    this.homeworkService
      .getAllHomeworksByGroupId(this.homeworkGroupId())
      .subscribe({
        next: homeworks => {
          this.homeworks.set(homeworks)
          this.onChangeHomeworksSize.emit(homeworks.length)
          this.isHomeworksLoading.set(false)
        },
        error: err => {
          const error = err as ErrorResponse
          this.showHomeworksLoadingErrorMessage(error.code)
        }
      })
  }

  private showCreateHomeworkErrorMessage(code: string) {
    const { summary, message } = createHomeworkErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showHomeworksLoadingErrorMessage(code: string) {
    const { summary, message } = homeworksLoadingErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showErrorMessage(summary: string, detail: string) {
    this.toastService.add({ severity: 'error', summary, detail })
  }
}
