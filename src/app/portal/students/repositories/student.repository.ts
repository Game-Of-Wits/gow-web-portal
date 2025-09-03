import { Injectable, inject } from '@angular/core'
import {
  collection,
  DocumentReference,
  doc,
  Firestore,
  getDoc,
  getDocs,
  limit,
  query,
  where
} from '@angular/fire/firestore'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { StudentProfileRepository } from '~/student-profiles/repositories/student-profile.repository'
import { StudentDbModel } from '../models/StudentDb.model'

@Injectable({ providedIn: 'root' })
export class StudentRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'students'
  private readonly collectionName = StudentRepository.collectionName

  public async getByIdAsync(studentId: string): Promise<StudentDbModel | null> {
    const studentRef = this.getRefById(studentId)
    const studentSnapshot = await getDoc(studentRef)

    if (!studentSnapshot.exists()) return null

    return {
      id: studentSnapshot.id,
      ...studentSnapshot.data()
    } as StudentDbModel
  }

  public async getByProfileIdAsync(
    studentProfileId: string
  ): Promise<StudentDbModel | null> {
    const studentProfileRef = StudentProfileRepository.getRefById(
      this.firestore,
      studentProfileId
    )

    const studentsQuery = query(
      this.getCollectionRef(),
      where('profile', '==', studentProfileRef),
      limit(1)
    )

    const studentsSnapshot = await getDocs(studentsQuery)

    if (studentsSnapshot.size === 0) return null

    const studentSnapshot = studentsSnapshot.docs[0]

    return {
      ...studentSnapshot.data(),
      id: studentSnapshot.id
    } as StudentDbModel
  }

  public async getAllByClassroomIdAsync(
    classroomId: string
  ): Promise<StudentDbModel[]> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      classroomId
    )

    const studentQuery = query(
      this.getCollectionRef(),
      where('classroom', '==', classroomRef)
    )

    const studentsSnapshot = await getDocs(studentQuery)

    if (studentsSnapshot.size === 0) return []

    return studentsSnapshot.docs.map(
      doc =>
        ({
          id: doc.id,
          ...doc.data()
        }) as StudentDbModel
    )
  }

  public async getAllByClassroomIdsAsync(
    classroomsIds: string[]
  ): Promise<StudentDbModel[]> {
    const studentsPromises = classroomsIds.map(async classroomId => {
      const classroomRef = this.getRefById(classroomId)
      const studentsQuery = query(
        this.getCollectionRef(),
        where('classroom', '==', classroomRef)
      )
      return await getDocs(studentsQuery)
    })

    const studentsSnapshots = await Promise.all(studentsPromises)

    const studentSnapshotDocs = studentsSnapshots
      .map(student => student.docs)
      .flat()

    return studentSnapshotDocs.map(
      doc => ({ ...doc.data(), id: doc.id }) as StudentDbModel
    )
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, StudentRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${StudentRepository.collectionName}/${id}`)
  }

  public static queryAllByClassroomRef(
    db: Firestore,
    classroomRef: DocumentReference
  ) {
    return query(
      StudentRepository.getCollectionRef(db),
      where('classroom', '==', classroomRef)
    )
  }
}
