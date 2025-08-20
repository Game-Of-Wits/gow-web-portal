import { Component, inject, OnInit, signal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { LucideAngularModule, Send } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { Toast } from 'primeng/toast'
import { ClassroomAdminPanelLoadingComponent } from '~/classrooms/components/ui/classroom-admin-panel-loading.component'
import { HomeworkCardListComponent } from '~/homeworks/components/homework-card-list/homework-card-list.component'
import { HomeworkGroupModel } from '~/homeworks/models/HomeworkGroup.model'
import { HomeworkGroupService } from '~/homeworks/services/homework-group/homework-group.service'
import { PageHeaderComponent } from '~/shared/components/ui/page-header/page-header.component'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'

const homeworkGroupLoadingErrorMessages = {
  ...commonErrorMessages
}

@Component({
  selector: 'gow-classroom-admin-panel-homework-group-details',
  templateUrl: './classroom-admin-panel-homework-group-details.component.html',
  imports: [
    PageHeaderComponent,
    ButtonModule,
    LucideAngularModule,
    Toast,
    HomeworkCardListComponent,
    ClassroomAdminPanelLoadingComponent
  ],
  providers: [MessageService]
})
export class ClassroomAdminPanelHomeworkGroupDetailsPageComponent
  implements OnInit
{
  public readonly sendIcon = Send

  private readonly homeworkGroupService = inject(HomeworkGroupService)

  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly toastService = inject(MessageService)

  public homeworkGroup = signal<HomeworkGroupModel | null>(null)
  public isHomeworkGroupLoading = signal<boolean>(true)

  public defaultBackPath = {
    commands: ['../'],
    extras: { relativeTo: this.activatedRoute }
  }

  ngOnInit(): void {
    this.loadHomeworkGroup()
  }

  private loadHomeworkGroup() {
    const homeworkGroupId =
      this.activatedRoute.snapshot.paramMap.get('homeworkGroupId')

    if (homeworkGroupId === null) return

    this.homeworkGroupService
      .getHomeworkGroupById(homeworkGroupId)
      .then(homeworkGroup => {
        this.homeworkGroup.set(homeworkGroup)
        this.isHomeworkGroupLoading.set(false)
      })
      .catch(err => {
        const error = err as ErrorResponse
        this.showHomeworkGroupLoadingErrorMessage(error.code)
      })
  }

  private showHomeworkGroupLoadingErrorMessage(code: string) {
    const { summary, message } = homeworkGroupLoadingErrorMessages[code]
    this.showErrorMessage(summary, message)
  }

  private showErrorMessage(summary: string, detail: string) {
    this.toastService.add({ severity: 'error', summary, detail })
  }
}
