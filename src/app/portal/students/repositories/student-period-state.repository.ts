import { Injectable, inject } from '@angular/core'
import {
  collection,
  DocumentData,
  doc,
  Firestore,
  getDoc,
  getDocs,
  QuerySnapshot,
  query,
  where
} from '@angular/fire/firestore'
import { from, map, Observable, switchMap } from 'rxjs'
import { AcademicPeriodRespository } from '~/academic-periods/repositories/academic-period.repository'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { StudentPeriodStatesDbModel } from '../models/StudentPeriodStatesDb.model'
import { StudentRepository } from './student.repository'

@Injectable({ providedIn: 'root' })
export class StudentPeriodStateRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'student_period_states'
  private readonly collectionName = StudentPeriodStateRepository.collectionName

  public async getByIdAsync(
    id: string
  ): Promise<StudentPeriodStatesDbModel | null> {
    const ref = this.getRefById(id)

    const snapshot = await getDoc(ref)
    if (!snapshot.exists()) return null

    return {
      id: snapshot.id,
      ...snapshot.data()
    } as StudentPeriodStatesDbModel
  }

  public getAllByClassroomIdAndExperienceSession({
    classroomId,
    academicPeriodId
  }: {
    classroomId: string
    academicPeriodId: string
  }): Observable<StudentPeriodStatesDbModel[]> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      classroomId
    )
    const academicPeriodRef = AcademicPeriodRespository.getRefById(
      this.firestore,
      academicPeriodId
    )

    const studentsQuery = StudentRepository.queryAllByClassroomRef(
      this.firestore,
      classroomRef
    )

    return from(getDocs(studentsQuery)).pipe(
      switchMap((studentsSnapshot: QuerySnapshot<DocumentData>) => {
        const studentRefs = studentsSnapshot.docs.map(doc => doc.ref)

        if (studentRefs.length === 0) {
          return from([])
        }

        const studentPeriodStatesQuery = query(
          this.getCollectionRef(),
          where('student', 'in', studentRefs),
          where('academicPeriod', '==', academicPeriodRef)
        )

        return from(getDocs(studentPeriodStatesQuery)).pipe(
          map(snapshot => {
            return snapshot.docs.map(
              doc =>
                ({
                  id: doc.id,
                  ...doc.data()
                }) as StudentPeriodStatesDbModel
            )
          })
        )
      })
    )
  }

  public async getAllByStudentId(
    studentId: string
  ): Promise<StudentPeriodStatesDbModel[]> {
    const studentRef = StudentRepository.getRefById(this.firestore, studentId)

    const studentPeriodStatesQuery = query(
      this.getCollectionRef(),
      where('student', '==', studentRef)
    )

    const studentPeriodStatesSnapshot = await getDocs(studentPeriodStatesQuery)

    return studentPeriodStatesSnapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() }) as StudentPeriodStatesDbModel
    )
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, StudentPeriodStateRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${StudentPeriodStateRepository.collectionName}/${id}`)
  }
}
