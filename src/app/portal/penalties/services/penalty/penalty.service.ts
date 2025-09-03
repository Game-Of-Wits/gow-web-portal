import { Injectable, inject } from '@angular/core'
import { FirebaseError } from '@angular/fire/app'
import { FirestoreError } from '@angular/fire/firestore'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { catchError, map, Observable, throwError } from 'rxjs'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { PenaltyMapper } from '~/penalties/mappers/penalty.mapper'
import { CreatePenalty } from '~/penalties/models/CreatePenalty.model'
import { PenaltyModel } from '~/penalties/models/Penalty.model'
import { UpdatePenalty } from '~/penalties/models/UpdatePenalty.model'
import { PenaltyRepository } from '~/penalties/repositories/penalty.repository'

@Injectable({ providedIn: 'root' })
export class PenaltyService {
  private readonly penaltyRepository = inject(PenaltyRepository)
  private readonly classroomRepository = inject(ClassroomRepository)

  public async getAllPenaltiesByClassroomAsync(
    classroomId: string
  ): Promise<PenaltyModel[]> {
    try {
      const classroom = await this.classroomRepository.getById(classroomId)
      if (classroom === null) throw new ErrorResponse('classroom-not-exist')

      const penalties = await this.penaltyRepository.getAllByClassroomIdAsync(
        classroom.id
      )

      return PenaltyMapper.toListModel(penalties)
    } catch (err) {
      const error = err as FirebaseError | ErrorResponse
      throw new ErrorResponse(error.code)
    }
  }

  public getAllPenaltiesByClassroom(
    classroomId: string
  ): Observable<PenaltyModel[]> {
    return this.penaltyRepository.getAllByClassroomId(classroomId).pipe(
      map(penalties => {
        const penaltiesMapped = PenaltyMapper.toListModel(penalties)
        return penaltiesMapped.sort((a, b) => a.name.localeCompare(b.name))
      }),
      catchError(err => {
        if (err instanceof FirestoreError)
          return throwError(() => new ErrorResponse(err.code))
        return throwError(() => err)
      })
    )
  }

  public async createPenalty(data: CreatePenalty): Promise<PenaltyModel> {
    try {
      const classroom = await this.penaltyRepository.getByIdAsync(
        data.classroomId
      )
      if (classroom === null) throw new ErrorResponse('classroom-not-exist')

      const newPenalty = await this.penaltyRepository.create(data)

      return PenaltyMapper.toModel(newPenalty)
    } catch (err) {
      const error = err as FirebaseError | ErrorResponse
      throw new ErrorResponse(error.code)
    }
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
      const error = err as FirebaseError | ErrorResponse
      throw new ErrorResponse(error.code)
    }
  }
}
