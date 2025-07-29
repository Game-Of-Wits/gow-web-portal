import { DatePipe } from '@angular/common'
import { Component, computed, inject, OnInit, signal } from '@angular/core'
import { MessageService } from 'primeng/api'
import { TableModule } from 'primeng/table'
import { ClassroomAdminPanelContextService } from '~/classrooms/contexts/classroom-admin-panel-context/classroom-admin-panel-context.service'
import { HomeworkGroupModel } from '~/homeworks/models/HomeworkGroup.model'
import { HomeworkGroupService } from '~/homeworks/services/homework-group/homework-group.service'
import { SectionTitleComponent } from '~/shared/components/ui/section-title/section-title.component'

@Component({
  selector: 'gow-classroom-admin-panel-homeworks',
  templateUrl: './classroom-admin-panel-homeworks.component.html',
  imports: [DatePipe, TableModule, SectionTitleComponent],
  providers: [MessageService]
})
export class ClassroomAdminPanelHomeworksPageComponent implements OnInit {
  private readonly homeworksGroupService = inject(HomeworkGroupService)

  private readonly context = inject(ClassroomAdminPanelContextService)

  public homeworkGroups = signal<HomeworkGroupModel[]>([])
  public isHomeworkGroupsLoading = signal<boolean>(true)

  public readonly deliveredHomeworkGroups = computed(() =>
    this.homeworkGroups().filter(group => group.deliveredAt !== null)
  )
  public readonly notDeliveredHomeworkGroups = computed(() =>
    this.homeworkGroups().filter(group => group.deliveredAt === null)
  )

  ngOnInit(): void {
    this.loadHomeworkGroups()
  }

  public loadHomeworkGroups() {
    const classroomId = this.context.classroom()?.id ?? null

    if (classroomId === null) return

    this.isHomeworkGroupsLoading.set(true)

    this.homeworksGroupService
      .getAllHomeworkGroupsByClassroomAsync(classroomId)
      .then(groups => {
        this.homeworkGroups.set(groups)
        this.isHomeworkGroupsLoading.set(false)
      })
  }
}
