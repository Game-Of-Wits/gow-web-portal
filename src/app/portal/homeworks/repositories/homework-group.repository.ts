import { Injectable, inject } from '@angular/core'
import {
  addDoc,
  CollectionReference,
  collection,
  DocumentReference,
  DocumentSnapshot,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where
} from '@angular/fire/firestore'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
import { CreateHomeworkGroup } from '../models/CreateHomeworkGroup.model'
import { HomeworkGroupDbModel } from '../models/HomeworkGroupDb.model'

@Injectable({ providedIn: 'root' })
export class HomeworkGroupRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'homework_groups'
  private readonly collectionName = HomeworkGroupRepository.collectionName

  public async getAllByClassroomIdAsync(
    classroomId: string
  ): Promise<HomeworkGroupDbModel[]> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      classroomId
    )

    const homeworkGroupsQuery = query(
      this.getCollectionRef(),
      where('classroom', '==', classroomRef)
    )

    const homeworkGroupsSnapshot = await getDocs(homeworkGroupsQuery)

    return homeworkGroupsSnapshot.docs.map(
      doc =>
        ({
          id: doc.id,
          ...doc.data()
        }) as HomeworkGroupDbModel
    )
  }

  public async getByIdAsync(id: string): Promise<HomeworkGroupDbModel | null> {
    const homeworkGroupRef = this.getRefById(id)
    const homeworkGroupSnapshot = await getDoc(homeworkGroupRef)

    if (!homeworkGroupSnapshot.exists()) return null

    return {
      id: homeworkGroupSnapshot.id,
      ...homeworkGroupSnapshot.data()
    } as HomeworkGroupDbModel
  }

  public async existByIdAsync(id: string): Promise<boolean> {
    const homeworkGroupRef = this.getRefById(id)
    const homeworkGroupSnapshot = await getDoc(homeworkGroupRef)
    return homeworkGroupSnapshot.exists()
  }

  public async create(
    data: CreateHomeworkGroup
  ): Promise<HomeworkGroupDbModel> {
    const classroomRef = ClassroomRepository.getRefById(
      this.firestore,
      data.classroomId
    )

    const newHomeworkGroupRef = (await addDoc(this.getCollectionRef(), {
      name: data.name,
      homeworks: [],
      classroom: classroomRef,
      createdAt: Timestamp.now(),
      baseDateLimit: null,
      deliveredAt: null
    } as Omit<
      HomeworkGroupDbModel,
      'id'
    >)) as DocumentReference<HomeworkGroupDbModel>

    const newHomeworkGroupSnapshot: DocumentSnapshot<HomeworkGroupDbModel> =
      await getDoc(newHomeworkGroupRef)

    return {
      id: newHomeworkGroupSnapshot.id,
      ...newHomeworkGroupSnapshot.data()
    } as HomeworkGroupDbModel
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  private getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, HomeworkGroupRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${HomeworkGroupRepository.collectionName}/${id}`)
  }
}
