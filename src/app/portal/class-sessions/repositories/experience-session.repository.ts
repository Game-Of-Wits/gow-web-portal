import { Injectable, inject } from '@angular/core'
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  limit,
  Query,
  query,
  serverTimestamp,
  updateDoc,
  where
} from '@angular/fire/firestore'
import { ErrorCode } from '@shared/types/ErrorCode'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { from, map, Observable } from 'rxjs'
import { CreateExperienceSession } from '../models/CreateExperienceSession.model'
import { CreateExperienceSessionDb } from '../models/CreateExperienceSessionDb.model'
import { ExperienceSessionDbModel } from '../models/ExperienceSessionDb.model'
import { UpdateExperienceSessionDb } from '../models/UpdateExperienceSession.model'
import { ClassSessionRepository } from './class-session.repository'

@Injectable({ providedIn: 'root' })
export class ExperienceSessionRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'experience_sessions'
  private readonly collectionName = ExperienceSessionRepository.collectionName

  public async getById(
    experienceSessionId: string
  ): Promise<ExperienceSessionDbModel> {
    const snapshot = await getDoc(this.getRefById(experienceSessionId))

    if (!snapshot.exists()) throw new ErrorResponse(ErrorCode.NotFound)

    return {
      id: snapshot.id,
      ...snapshot.data()
    } as ExperienceSessionDbModel
  }

  public getActiveExperienceSessions(
    classSessionId: string
  ): Observable<ExperienceSessionDbModel[]> {
    const activeExperienceSessionsQuery =
      this.getActiveExperienceSessionQuery(classSessionId)

    return from(getDocs(activeExperienceSessionsQuery)).pipe(
      map(snapshot => {
        return snapshot.docs.map(
          doc => ({ ...doc.data(), id: doc.id }) as ExperienceSessionDbModel
        )
      })
    )
  }

  public async existsActiveExperienceSessionByClassSessionId(
    classSessionId: string
  ): Promise<boolean> {
    const activeExperienceSessionQuery =
      this.getActiveExperienceSessionQuery(classSessionId)
    const activeExperienceSessionSnapshot = await getDocs(
      activeExperienceSessionQuery
    )

    return !activeExperienceSessionSnapshot.empty
  }

  public async existsActiveExperienceSessionById(experienceSessionId: string) {
    const experienceSessionDb = await this.getById(experienceSessionId)
    return experienceSessionDb.endedAt === null
  }

  public async create(
    data: CreateExperienceSession
  ): Promise<ExperienceSessionDbModel> {
    const classSessionRef = ClassSessionRepository.getRefById(
      this.firestore,
      data.classSessionId
    )

    const saveData: CreateExperienceSessionDb = {
      classSession: classSessionRef,
      experience: data.experience,
      endedAt: null,
      startedAt: serverTimestamp()
    }

    if (data.rules) {
      saveData.rules = {
        shift: data.rules.shift
      }
    }

    const newExperienceSessionRef = await addDoc(
      this.getCollectionRef(),
      saveData
    )

    const newExperienceSessionSnapshot = await getDoc(newExperienceSessionRef)

    return {
      id: newExperienceSessionSnapshot.id,
      ...newExperienceSessionSnapshot.data()
    } as ExperienceSessionDbModel
  }

  public updateById(
    experienceSessionId: string,
    data: Partial<UpdateExperienceSessionDb>
  ) {
    return updateDoc(this.getRefById(experienceSessionId), data)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getActiveExperienceSessionQuery(
    classSessionId: string
  ): Query<ExperienceSessionDbModel> {
    const classSessionRef = ClassSessionRepository.getRefById(
      this.firestore,
      classSessionId
    )

    return query(
      this.getCollectionRef(),
      where('classSession', '==', classSessionRef),
      where('endedAt', '==', null),
      limit(1)
    ) as Query<ExperienceSessionDbModel>
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${ExperienceSessionRepository.collectionName}/${id}`)
  }
}
