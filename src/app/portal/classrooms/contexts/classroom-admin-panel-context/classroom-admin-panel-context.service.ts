import { Injectable, signal } from '@angular/core'
import { AcademicPeriodModel } from '~/academic-periods/models/AcademicPeriod.model'
import { ClassSessionModel } from '~/class-sessions/models/ClassSession.model'
import { ExperienceSessionModel } from '~/class-sessions/models/ExperienceSession.model'

import { ClassroomModel } from '~/classrooms/models/Classroom.model'

@Injectable({ providedIn: 'root' })
export class ClassroomAdminPanelContextService {
  public classroom = signal<ClassroomModel | null>(null)
  public academicPeriod = signal<AcademicPeriodModel | null>(null)
  public classSession = signal<ClassSessionModel | null>(null)
  public experienceSession = signal<ExperienceSessionModel | null>(null)
}
