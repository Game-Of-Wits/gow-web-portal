import { Component, inject, input, OnInit, signal } from '@angular/core'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { LucideAngularModule, Plus } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { Toast } from 'primeng/toast'
import { HomeworkFormMapper } from '~/homeworks/mappers/homework-form.mapper'
import { HomeworkModel } from '~/homeworks/models/Homework.model'
import { HomeworkService } from '~/homeworks/services/homework/homework.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { HomeworkCardComponent } from '../homework-card/homework-card.component'
import {
  HomeworkFormDialogComponent,
  HomeworkFormSubmit
} from '../homework-form-dialog/homework-form-dialog.component'

const homeworksLoadingErrorMessages = {
  ...commonErrorMessages
}

const createHomeworkErrorMessages = {
  ...commonErrorMessages
}

@Component({
  selector: 'gow-homework-card-list',
  templateUrl: './homework-card-list.component.html',
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

  public homeworkGroupId = input.required<string>({ alias: 'homeworkGroupId' })

  public homeworks = signal<HomeworkModel[]>([])
  public isHomeworksLoading = signal<boolean>(true)

  public showCreateHomework = signal<boolean>(false)

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
    this.homeworkService
      .create(
        HomeworkFormMapper.toCreate(
          this.homeworkGroupId(),
          submit.result.formData
        )
      )
      .then(homework => {
        this.homeworks.update(homeworks => [...homeworks, homework])
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
