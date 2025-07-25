import { Injectable, inject } from '@angular/core'
import { map, Observable } from 'rxjs'
import { PenaltyMapper } from '~/penalties/mappers/penalty.mapper'
import { PenaltyModel } from '~/penalties/models/Penalty.model'
import { PenaltyRepository } from '~/penalties/repositories/penalty.repository'

@Injectable({ providedIn: 'root' })
export class PenaltyService {
  private readonly penaltyRepository = inject(PenaltyRepository)

  public getAllPenaltiesByClassroom(
    classroomId: string
  ): Observable<PenaltyModel[]> {
    return this.penaltyRepository
      .getAllByClassroomId(classroomId)
      .pipe(map(penalties => PenaltyMapper.toListModel(penalties)))
  }
}
