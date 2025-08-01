import { Injectable, inject } from '@angular/core'
import { FirebaseError } from '@angular/fire/app'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { map, Observable } from 'rxjs'
import { PenaltyMapper } from '~/penalties/mappers/penalty.mapper'
import { CreatePenalty } from '~/penalties/models/CreatePenalty.model'
import { PenaltyModel } from '~/penalties/models/Penalty.model'
import { UpdatePenalty } from '~/penalties/models/UpdatePenalty.model'
import { PenaltyRepository } from '~/penalties/repositories/penalty.repository'

@Injectable({ providedIn: 'root' })
export class PenaltyService {
  private readonly penaltyRepository = inject(PenaltyRepository)

  public getAllPenaltiesByClassroom(
    classroomId: string
  ): Observable<PenaltyModel[]> {
    return this.penaltyRepository.getAllByClassroomId(classroomId).pipe(
      map(penalties => {
        const penaltiesMapped = PenaltyMapper.toListModel(penalties)
        return penaltiesMapped.sort((a, b) => a.name.localeCompare(b.name))
      })
    )
  }

  public async createPenalty(data: CreatePenalty): Promise<PenaltyModel> {
    return await this.penaltyRepository.create(data)
  }

  public async updatePenaltyById(
    penaltyId: string,
    data: Partial<UpdatePenalty>
  ): Promise<void> {
    await this.penaltyRepository.updateById(penaltyId, data)
  }

  public async deletePenaltyById(penaltyId: string): Promise<void> {
    try {
      const penaltyExists = this.penaltyRepository.existsById(penaltyId)

      if (!penaltyExists) throw new ErrorResponse('penalty-not-exist')

      await this.penaltyRepository.deleteById(penaltyId)
    } catch (err) {
      if (err instanceof FirebaseError || err instanceof ErrorResponse) {
        throw new ErrorResponse(err.code)
      }
    }
  }
}
