import { Injectable, inject } from '@angular/core'
import {
  collection,
  doc,
  Firestore,
  getDocs,
  query,
  where
} from '@angular/fire/firestore'
import { ClassroomRepository } from '~/classrooms/repositories/classroom.repository'
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
