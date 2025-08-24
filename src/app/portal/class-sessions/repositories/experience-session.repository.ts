import { Injectable, inject } from '@angular/core'
import {
  addDoc,
  collection,
  DocumentReference,
  DocumentSnapshot,
  doc,
  Firestore,
  getDoc,
  getDocs,
  limit,
  Query,
  query,
  Timestamp,
  updateDoc,
  where
} from '@angular/fire/firestore'
import { ErrorCode } from '@shared/types/ErrorCode'
import { ErrorResponse } from '@shared/types/ErrorResponse'
import { from, map, Observable } from 'rxjs'
import { CreateExperienceSession } from '../models/CreateExperienceSession.model'
import {
  ExperienceSessionDbModel,
  ExperienceSessionDbWithoutId
} from '../models/ExperienceSessionDb.model'
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
      ...(snapshot.data() as ExperienceSessionDbWithoutId)
    }
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

    const newExperienceSessionRef = (await addDoc(this.getCollectionRef(), {
      classSession: classSessionRef,
      experience: data.experience,
      endedAt: null,
      startedAt: Timestamp.now()
    })) as DocumentReference<ExperienceSessionDbModel>

    const newExperienceSessionSnapshot: DocumentSnapshot<ExperienceSessionDbModel> =
      await getDoc(newExperienceSessionRef)

    return {
      id: newExperienceSessionSnapshot.id,
      ...(newExperienceSessionSnapshot.data() as ExperienceSessionDbWithoutId)
    }
  }

  public updateById(
    experienceSessionId: string,
    data: Partial<ExperienceSessionDbModel>
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
