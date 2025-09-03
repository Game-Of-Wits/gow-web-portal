import { Injectable, signal } from '@angular/core'
import { AcademicPeriodModel } from '~/academic-periods/models/AcademicPeriod.model'

@Injectable({ providedIn: 'root' })
export class GeneralPanelContextService {
  public activeAcademicPeriod = signal<AcademicPeriodModel | null>(null)
}
