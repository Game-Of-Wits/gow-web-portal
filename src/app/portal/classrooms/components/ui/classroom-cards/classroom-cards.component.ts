import { Component, computed, inject, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { LucideAngularModule, Plus, Presentation } from 'lucide-angular'
import { ClassroomModel } from '~/classrooms/models/Classroom.model'
import { GeneralPanelContextService } from '~/shared/contexts/general-panel-context/general-panel-context.service'
import { educationLevelFormats } from '~/shared/data/educationLevelFormats'
import { gradeYearFormats } from '~/shared/data/gradeYearFormats'
import { DefaultSchoolStore } from '~/shared/store/default-school.store'

@Component({
  selector: 'gow-classroom-cards',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './classroom-cards.component.html'
})
export class ClassroomCardsComponent {
  public readonly classroomIcon = Presentation
  public readonly addIcon = Plus

  private readonly defaultSchoolStore = inject(DefaultSchoolStore)
  private readonly context = inject(GeneralPanelContextService)

  public classrooms = input.required<ClassroomModel[]>({ alias: 'classrooms' })

  public schoolId = computed(() => this.defaultSchoolStore.school()?.id)
  public hasAcademicPeriod = computed(
    () => this.context.activeAcademicPeriod() !== null
  )

  public getGradeYearInfo(gradeYearId: string): string {
    const gradeYear =
      this.defaultSchoolStore
        .gradeYears()
        ?.find(gradeYear => gradeYear.id === gradeYearId) ?? null

    if (!gradeYear) return ''

    return `${educationLevelFormats[gradeYear.educationLevel]} · ${gradeYearFormats[gradeYear.gradeYear]}`
  }
}
