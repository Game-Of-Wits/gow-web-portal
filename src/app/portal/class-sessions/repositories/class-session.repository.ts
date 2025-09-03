import { Injectable, inject } from '@angular/core'
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  limit,
  Query,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  writeBatch
} from '@angular/fire/firestore'
import { from, map, Observable } from 'rxjs'
import { AcademicPeriodDbModel } from '~/academic-periods/models/AcademicPeriodDb.model'
import { AcademicPeriodRespository } from '~/academic-periods/repositories/academic-period.repository'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { ClassSessionDbModel } from '../models/ClassSessionDb.model'
import { CreateClassSession } from '../models/CreateClassSession.model'
import { UpdateClassSessionDb } from '../models/UpdateClassSession.model'

@Injectable({ providedIn: 'root' })
export class ClassSessionRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'class_sessions'
  private readonly collectionName = ClassSessionRepository.collectionName

  public async getById(sessionId: string): Promise<ClassSessionDbModel | null> {
    const snapshot = await getDoc(this.getRefById(sessionId))

    if (!snapshot.exists()) return null

    return {
      ...snapshot.data(),
      id: snapshot.id
    } as ClassSessionDbModel
  }

  public getActiveClassSessions({
    classroomId,
    academicPeriodId
  }: {
    classroomId: string
    academicPeriodId: string
  }): Observable<ClassSessionDbModel[]> {
    const activeClassSessionQuery = this.getActiveClassSessionQuery({
      classroomId,
      academicPeriodId
    })
    return from(getDocs(activeClassSessionQuery)).pipe(
      map(snapshots =>
        snapshots.docs.map(
          doc => ({ ...doc.data(), id: doc.id }) as ClassSessionDbModel
        )
      )
    )
  }

  public async existsActiveClassSession({
    classroomId,
    academicPeriodId
  }: {
    classroomId: string
    academicPeriodId: string
  }): Promise<boolean> {
    const activeClassSessionQuery = this.getActiveClassSessionQuery({
      classroomId,
      academicPeriodId
    })
    const activeClassSessionSnapshot = await getDocs(activeClassSessionQuery)

    return !activeClassSessionSnapshot.empty
  }

  public async existsActiveClassSessionById(
    classSessionId: string
  ): Promise<boolean> {
    const classSession = await this.getById(classSessionId)
    return classSession?.endedAt === null
  }

  public async create(data: CreateClassSession): Promise<ClassSessionDbModel> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      data.classroomId
    )

    const academicPeriodRef = AcademicPeriodRespository.getRefById(
      this.firestore,
      data.academicPeriodId
    )

    const academicPeriodSnapshot = await getDoc(academicPeriodRef)

    const academicPeriod = {
      ...academicPeriodSnapshot.data(),
      id: academicPeriodSnapshot.id
    } as AcademicPeriodDbModel

    const batch = writeBatch(this.firestore)

    const newClassSessionRef = this.generateRef()
    batch.set(newClassSessionRef, {
      classroom: classroomRef,
      academicPeriod: academicPeriodRef,
      endedAt: null,
      startedAt: serverTimestamp(),
      experienceSessions: []
    })

    batch.update(academicPeriodRef, {
      classSessions: [...academicPeriod.classSessions, newClassSessionRef]
    })

    await batch.commit()

    const newClassSessionSnapshot = await getDoc(newClassSessionRef)

    return {
      ...newClassSessionSnapshot.data(),
      id: newClassSessionSnapshot.id
    } as ClassSessionDbModel
  }

  public updateById(
    experienceSessionId: string,
    data: Partial<UpdateClassSessionDb>
  ) {
    return updateDoc(this.getRefById(experienceSessionId), data)
  }

  private generateRef() {
    return doc(this.getCollectionRef())
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getActiveClassSessionQuery({
    academicPeriodId,
    classroomId
  }: {
    academicPeriodId: string
    classroomId: string
  }): Query<ClassSessionDbModel> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      classroomId
    )

    const academicPeriodRef = AcademicPeriodRespository.getRefById(
      this.firestore,
      academicPeriodId
    )

    return query(
      this.getCollectionRef(),
      where('classroom', '==', classroomRef),
      where('academicPeriod', '==', academicPeriodRef),
      where('endedAt', '==', null),
      limit(1)
    ) as Query<ClassSessionDbModel>
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${ClassSessionRepository.collectionName}/${id}`)
  }
}
