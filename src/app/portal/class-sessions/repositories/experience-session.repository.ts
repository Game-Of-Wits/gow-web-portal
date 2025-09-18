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
  where,
  writeBatch
} from '@angular/fire/firestore'
import { from, map, Observable } from 'rxjs'
import { ClassSessionDbModel } from '../models/ClassSessionDb.model'
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
  ): Promise<ExperienceSessionDbModel | null> {
    const snapshot = await getDoc(this.getRefById(experienceSessionId))

    if (!snapshot.exists()) return null

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

  public async existsActiveExperienceSessionById(
    experienceSessionId: string
  ): Promise<boolean> {
    const experienceSessionDb = await this.getById(experienceSessionId)

    if (experienceSessionDb === null) return false

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

    const batch = writeBatch(this.firestore)

    const newExperienceSessionRef = this.generateRef()

    batch.set(newExperienceSessionRef, saveData)

    const classSessionSnapshot = await getDoc(classSessionRef)

    const classSession = classSessionSnapshot.data() as ClassSessionDbModel

    batch.update(classSessionRef, {
      experienceSessions: [
        ...classSession.experienceSessions,
        newExperienceSessionRef
      ]
    })

    await batch.commit()

    const newExperienceSessionSnapshot = await getDoc(newExperienceSessionRef)

    return {
      ...newExperienceSessionSnapshot.data(),
      id: newExperienceSessionSnapshot.id
    } as ExperienceSessionDbModel
  }

  public updateById(
    experienceSessionId: string,
    data: Partial<UpdateExperienceSessionDb>
  ) {
    return updateDoc(this.getRefById(experienceSessionId), data)
  }

  private generateRef() {
    return doc(this.getCollectionRef())
  }

  public static generateRef(db: Firestore) {
    return doc(ExperienceSessionRepository.getCollectionRef(db))
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

  public static getCollectionRef(db: Firestore) {
    return collection(db, ExperienceSessionRepository.collectionName)
  }
}
