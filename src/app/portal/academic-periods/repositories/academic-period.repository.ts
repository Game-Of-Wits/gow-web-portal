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
import { from, map, type Observable } from 'rxjs'
import type { AcademicPeriodDbModel } from '~/academic-periods/models/AcademicPeriodDb.model'
import { SchoolModel } from '~/schools/models/School.model'
import { SchoolRepository } from '~/schools/repositories/school.repository'
import { StudentRepository } from '~/students/repositories/student.repository'
import type { CreateAcademicPeriod } from '../models/CreateAcademicPeriod.model'

@Injectable({ providedIn: 'root' })
export class AcademicPeriodRespository {
  private readonly firestore = inject(Firestore)

  private readonly studentRepository = inject(StudentRepository)

  private static readonly collectionName = 'academic_periods'
  private readonly collectionName = AcademicPeriodRespository.collectionName

  public async getByIdAsync(
    academicPeriodId: string
  ): Promise<AcademicPeriodDbModel | null> {
    const snapshot = await getDoc(this.getRefById(academicPeriodId))

    if (!snapshot.exists()) return null

    return {
      id: snapshot.id,
      ...snapshot.data()
    } as AcademicPeriodDbModel
  }

  public async getAllBySchoolId(
    schoolId: string
  ): Promise<AcademicPeriodDbModel[]> {
    const schoolRef = SchoolRepository.getSchoolRefById(
      this.firestore,
      schoolId
    )

    const academicPeriodsQuery = query(
      this.getCollectionRef(),
      where('school', '==', schoolRef)
    )

    const academicPeriodsSnapshot = await getDocs(academicPeriodsQuery)

    return academicPeriodsSnapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() }) as AcademicPeriodDbModel
    )
  }

  public async existsById(academicPeriodId: string): Promise<boolean> {
    const academicPeriodSnapshot = await getDoc(
      this.getRefById(academicPeriodId)
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

    const schoolSnapshot = await getDoc(schoolRef)

    const school = {
      ...schoolSnapshot.data(),
      id: schoolSnapshot.id
    } as SchoolModel

    const batch = writeBatch(this.firestore)

    const academicPeriodRef = this.generateRef()
    batch.set(academicPeriodRef, {
      name: data.name,
      classSessions: [],
      endedAt: null,
      startedAt: serverTimestamp(),
      school: schoolRef
    })

    batch.update(schoolRef, {
      academicPeriods: [...school.academicPeriods, academicPeriodRef]
    })

    await batch.commit()

    const newAcademicPeriodSnapshot = await getDoc(academicPeriodRef)

    return {
      ...newAcademicPeriodSnapshot.data(),
      id: newAcademicPeriodSnapshot.id
    } as AcademicPeriodDbModel
  }

  public async updateById(
    academicPeriodId: string,
    data: Partial<AcademicPeriodDbModel>
  ): Promise<void> {
    await updateDoc(this.getRefById(academicPeriodId), data)
  }

  public async existsByEqualNameAndEqualStartAtYear(
    name: string,
    year: number
  ) {
    const startOfYear = Timestamp.fromDate(new Date(year, 0, 1))
    const endOfYear = Timestamp.fromDate(new Date(year + 1, 0, 1))

    const academicPeriodsQuery = query(
      this.getCollectionRef(),
      where('name', '==', name),
      where('startedAt', '>=', startOfYear),
      where('startedAt', '<', endOfYear)
    )

    const academicPeriodsSnapshot = await getDocs(academicPeriodsQuery)
    return !academicPeriodsSnapshot.empty
  }

  public async getSchoolActiveAcademicPeriodAsync(
    schoolId: string
  ): Promise<AcademicPeriodDbModel | null> {
    const activeAcademicPeriodsQuery =
      this.getSchoolActiveAcademicPeriodQuery(schoolId)

    const activeAcademicPeriodsSnapshot = await getDocs(
      activeAcademicPeriodsQuery
    )

    if (activeAcademicPeriodsSnapshot.size === 0) return null

    const activeAcademicPeriodSnapshot = activeAcademicPeriodsSnapshot.docs[0]

    return {
      ...activeAcademicPeriodSnapshot.data(),
      id: activeAcademicPeriodSnapshot.id
    }
  }

  public getSchoolActiveAcademicPeriod(
    schoolId: string
  ): Observable<AcademicPeriodDbModel[]> {
    const activeAcademicPeriodsQuery =
      this.getSchoolActiveAcademicPeriodQuery(schoolId)

    return from(getDocs(activeAcademicPeriodsQuery)).pipe(
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

  public async endAcademicPeriod(
    academicPeriodId: string,
    classroomsIds: string[]
  ): Promise<void> {
    const academicPeriodRef = this.getRefById(academicPeriodId)
    const schoolStudents =
      await this.studentRepository.getAllByClassroomIdsAsync(classroomsIds)

    const batch = writeBatch(this.firestore)

    batch.update(academicPeriodRef, {
      endedAt: serverTimestamp()
    })

    schoolStudents.forEach(student => {
      const studentRef = StudentRepository.getRefById(
        this.firestore,
        student.id
      )

      batch.update(studentRef, {
        experiences: {
          SHADOW_WARFARE: null,
          MASTERY_ROAD: null
        }
      })
    })

    await batch.commit()
  }

  private getSchoolActiveAcademicPeriodQuery(
    schoolId: string
  ): Query<AcademicPeriodDbModel> {
    const schoolRef = SchoolRepository.getSchoolRefById(
      this.firestore,
      schoolId
    )

    return query(
      this.getCollectionRef(),
      where('school', '==', schoolRef),
      where('endedAt', '==', null),
      limit(1)
    ) as Query<AcademicPeriodDbModel>
  }

  private generateRef() {
    return doc(this.getCollectionRef())
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${AcademicPeriodRespository.collectionName}/${id}`)
  }
}
