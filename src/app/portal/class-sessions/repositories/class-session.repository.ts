import { Injectable, inject } from '@angular/core'
import {
  addDoc,
  collection,
  collectionData,
  DocumentReference,
  DocumentSnapshot,
  doc,
  docData,
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
import { from, map, Observable } from 'rxjs'
import { AcademicPeriodRespository } from '~/academic-periods/repositories/academic-period.repository'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import {
  ClassSessionDbModel,
  ClassSessionDbWithoutId
} from '../models/ClassSessionDb.model'
import { CreateClassSession } from '../models/CreateClassSession.model'

@Injectable({ providedIn: 'root' })
export class ClassSessionRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'class_sessions'
  private readonly collectionName = ClassSessionRepository.collectionName

  public getByIdObserve(id: string): Observable<ClassSessionDbModel> {
    return docData(this.getRefById(id), {
      idField: 'id'
    }) as Observable<ClassSessionDbModel>
  }

  public async getById(sessionId: string): Promise<ClassSessionDbModel | null> {
    const snapshot = await getDoc(this.getRefById(sessionId))

    if (!snapshot.exists()) return null

    return {
      id: snapshot.id,
      ...(snapshot.data() as ClassSessionDbWithoutId)
    }
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

    const newClassSessionRef = (await addDoc(this.getCollectionRef(), {
      classroom: classroomRef,
      academicPeriod: academicPeriodRef,
      endedAt: null,
      startedAt: Timestamp.now(),
      experienceSessions: []
    })) as DocumentReference<ClassSessionDbModel>

    const newClassSessionSnapshot: DocumentSnapshot<ClassSessionDbModel> =
      await getDoc(newClassSessionRef)

    const result = {
      id: newClassSessionSnapshot.id,
      ...(newClassSessionSnapshot.data() as ClassSessionDbWithoutId)
    }

    return result
  }

  public updateById(
    experienceSessionId: string,
    data: Partial<ClassSessionDbModel>
  ) {
    return updateDoc(this.getRefById(experienceSessionId), data)
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
