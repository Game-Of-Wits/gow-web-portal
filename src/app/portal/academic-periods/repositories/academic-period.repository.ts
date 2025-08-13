import { Injectable, inject } from '@angular/core'
import {
  addDoc,
  collection,
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
import { from, map, type Observable } from 'rxjs'
import type {
  AcademicPeriodDbModel,
  AcademicPeriodDbWithoutId
} from '~/academic-periods/models/AcademicPeriodDb.model'
import { SchoolRepository } from '~/schools/repositories/school.repository'
import type { CreateAcademicPeriod } from '../models/CreateAcademicPeriod.model'

@Injectable({ providedIn: 'root' })
export class AcademicPeriodRespository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'academic_periods'
  private readonly collectionName = AcademicPeriodRespository.collectionName

  public getByIdObserve(
    academicPeriodId: string
  ): Observable<AcademicPeriodDbModel | undefined> {
    return docData(this.getAcademicPeriodRefById(academicPeriodId), {
      idField: 'id'
    }) as Observable<AcademicPeriodDbModel>
  }

  public async getById(
    academicPeriodId: string
  ): Promise<AcademicPeriodDbModel | null> {
    const snapshot = await getDoc(
      this.getAcademicPeriodRefById(academicPeriodId)
    )

    if (!snapshot.exists()) return null

    return {
      id: snapshot.id,
      ...(snapshot.data() as AcademicPeriodDbWithoutId)
    }
  }

  public async existsById(academicPeriodId: string): Promise<boolean> {
    const academicPeriodSnapshot = await getDoc(
      this.getAcademicPeriodRefById(academicPeriodId)
    )

    return academicPeriodSnapshot.exists()
  }

  public async create(
    data: CreateAcademicPeriod
  ): Promise<AcademicPeriodDbModel> {
    const schoolRef = SchoolRepository.getSchoolRefById(
      this.firestore,
      data.schoolId
    )

    const newAcademicPeriodRef = (await addDoc(this.getAcademicPeriodsRef(), {
      name: data.name,
      classSessions: [],
      endedAt: null,
      startedAt: Timestamp.now(),
      school: schoolRef
    })) as DocumentReference<AcademicPeriodDbModel>

    const newAcademicPeriodSnapshot: DocumentSnapshot<AcademicPeriodDbModel> =
      await getDoc(newAcademicPeriodRef)

    return {
      id: newAcademicPeriodSnapshot.id,
      ...(newAcademicPeriodSnapshot.data() as AcademicPeriodDbWithoutId)
    }
  }

  public async updateById(
    academicPeriodId: string,
    data: Partial<AcademicPeriodDbModel>
  ): Promise<void> {
    await updateDoc(this.getAcademicPeriodRefById(academicPeriodId), data)
  }

  public async existsByEqualNameAndEqualStartAtYear(
    name: string,
    year: number
  ) {
    const startOfYear = Timestamp.fromDate(new Date(year, 0, 1))
    const endOfYear = Timestamp.fromDate(new Date(year + 1, 0, 1))

    const academicPeriodsQuery = query(
      this.getAcademicPeriodsRef(),
      where('name', '==', name),
      where('startedAt', '>=', startOfYear),
      where('startedAt', '<', endOfYear)
    )

    const academicPeriodsSnapshot = await getDocs(academicPeriodsQuery)
    return !academicPeriodsSnapshot.empty
  }

  public getSchoolActiveAcademicPeriod(
    schoolId: string
  ): Observable<AcademicPeriodDbModel[]> {
    const activeAcademicPeroidsQuery =
      this.getSchoolActiveAcademicPeriodQuery(schoolId)

    return from(getDocs(activeAcademicPeroidsQuery)).pipe(
      map(snapshots =>
        snapshots.docs.map(
          doc => ({ ...doc.data(), id: doc.id }) as AcademicPeriodDbModel
        )
      )
    )
  }

  public async existsSchoolActiveAcademicPeriod(
    schoolId: string
  ): Promise<boolean> {
    const activeAcademicPeroidsQuery =
      this.getSchoolActiveAcademicPeriodQuery(schoolId)
    const activeAcademicPeroidsSnapshot = await getDocs(
      activeAcademicPeroidsQuery
    )

    return !activeAcademicPeroidsSnapshot.empty
  }

  private getAcademicPeriodsRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getAcademicPeriodRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  private getSchoolActiveAcademicPeriodQuery(
    schoolId: string
  ): Query<AcademicPeriodDbModel> {
    const schoolRef = SchoolRepository.getSchoolRefById(
      this.firestore,
      schoolId
    )

    return query(
      this.getAcademicPeriodsRef(),
      where('school', '==', schoolRef),
      where('endedAt', '==', null),
      limit(1)
    ) as Query<AcademicPeriodDbModel>
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${AcademicPeriodRespository.collectionName}/${id}`)
  }
}
