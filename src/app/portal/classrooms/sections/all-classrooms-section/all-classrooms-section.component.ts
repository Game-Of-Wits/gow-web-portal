import { Component, inject, OnInit, signal } from '@angular/core'
import type { ErrorResponse } from '@shared/types/ErrorResponse'
import { LucideAngularModule, Plus } from 'lucide-angular'
import { MessageService } from 'primeng/api'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { Toast } from 'primeng/toast'
import { ClassroomCardsComponent } from '~/classrooms/components/ui/classroom-cards/classroom-cards.component'
import type { ClassroomModel } from '~/classrooms/models/Classroom.model'
import { ClassroomsService } from '~/classrooms/services/classrooms/classrooms.service'
import { commonErrorMessages } from '~/shared/data/commonErrorMessages'
import { DefaultSchoolStore } from '~/shared/store/default-school.store'

const loadClassroomsErrorMessages = commonErrorMessages

@Component({
  selector: 'gow-all-classrooms-section',
  templateUrl: './all-classrooms-section.component.html',
  imports: [
    Toast,
    ClassroomCardsComponent,
    ProgressSpinnerModule,
    LucideAngularModule
  ],
  providers: [MessageService]
})
export class AllClassroomsSectionComponent implements OnInit {
  private readonly classroomService = inject(ClassroomsService)
  private readonly toastService = inject(MessageService)
  public readonly defaultSchoolStore = inject(DefaultSchoolStore)

  public allClassroomsLoading = signal<boolean>(true)
  public allClassrooms = signal<ClassroomModel[] | null>(null)

  ngOnInit(): void {
    this.onLoadAllClassrooms()
  }

  private onLoadAllClassrooms() {
    this.classroomService
      .getAllClassrooms()
      .pipe()
      .subscribe({
        next: classrooms => {
          this.allClassrooms.set(classrooms)
          this.allClassroomsLoading.set(false)
        },
        error: err => {
          const error = err as ErrorResponse
          this.onShowErrorMessage(error.code)
        }
      })
  }

  private onShowErrorMessage(code: string) {
    const { summary, message } = loadClassroomsErrorMessages[code]
    this.toastService.add({ summary, detail: message, severity: 'error' })
  }
}
