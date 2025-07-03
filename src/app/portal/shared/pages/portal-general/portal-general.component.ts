import { Component } from '@angular/core'
import { AcademicPeriodControlSectionComponent } from '~/academic-periods/sections/academic-period-control-section/academic-period-control-section.component'
import { AllClassroomsSectionComponent } from '~/classrooms/sections/all-classrooms-section/all-classrooms-section.component'
import { SectionTitleComponent } from '~/shared/components/ui/section-title/section-title.component'

@Component({
  selector: 'gow-portal-general',
  templateUrl: './portal-general.component.html',
  imports: [
    SectionTitleComponent,
    AcademicPeriodControlSectionComponent,
    AllClassroomsSectionComponent
  ]
})
export class PortalGeneralPageComponent {}
