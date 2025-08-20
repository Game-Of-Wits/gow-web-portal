import { Injectable, inject } from '@angular/core'
import {
  addDoc,
  collection,
  DocumentReference,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  where
} from '@angular/fire/firestore'
import { from, map, Observable } from 'rxjs'
import { CreateHomeworkDb } from '../models/CreateHomeworkDb.model'
import { HomeworkAnswerDbModel } from '../models/HomeworkAnswerDb.model'
import { HomeworkDbModel } from '../models/HomeworkDb.model'
import { HomeworkGroupDbModel } from '../models/HomeworkGroupDb.model'
import { HomeworkGroupRepository } from './homework-group.repository'

@Injectable({ providedIn: 'root' })
export class HomeworkRepository {
  private readonly firestore = inject(Firestore)

  private static readonly collectionName = 'homeworks'
  private readonly collectionName = HomeworkRepository.collectionName

  public async getByIdAsync(id: string): Promise<HomeworkDbModel | null> {
    const homeworkRef = this.getRefById(id)

    const homeworkSnapshot = await getDoc(homeworkRef)
    if (!homeworkSnapshot.exists()) return null

    return {
      id: homeworkSnapshot.id,
      ...homeworkSnapshot.data()
    } as HomeworkDbModel
  }

  public getAllByHomeworkGroupId(
    homeworkGroupId: string
  ): Observable<HomeworkDbModel[]> {
    const homeworkGroupRef = HomeworkGroupRepository.getRefById(
      this.firestore,
      homeworkGroupId
    )
    const homeworksQuery = query(
      this.getCollectionRef(),
      where('group', '==', homeworkGroupRef)
    )

    return from(getDocs(homeworksQuery)).pipe(
      map(snapshot =>
        snapshot.docs.map(
          doc => ({ id: doc.id, ...doc.data() }) as HomeworkDbModel
        )
      )
    )
  }

  public async create(data: CreateHomeworkDb): Promise<HomeworkDbModel> {
    const homeworkGroupRef = HomeworkGroupRepository.getRefById(
      this.firestore,
      data.groupId
    )

    const newHomeworkRef = (await addDoc(this.getCollectionRef(), {
      image: data.image,
      name: data.name,
      group: homeworkGroupRef,
      category: data.category,
      content: {
        correctOption: data.content.correctOption,
        options: data.content.options
      }
    })) as DocumentReference<HomeworkDbModel>

    const newHomeworkSnapshot = await getDoc(newHomeworkRef)

    return {
      id: newHomeworkSnapshot.id,
      ...newHomeworkSnapshot.data()
    } as HomeworkDbModel
  }

  public async getHomeworkInfoByStudentPeriodAndClassroom(
    studentPeriodStateId: string,
    classroomId: string
  ) {
    const groupsSnap = await getDocs(
      query(
        collection(this.firestore, 'homework_groups'),
        where('deliveredAt', '!=', null),
        where('classroom', '==', doc(this.firestore, 'classrooms', classroomId))
      )
    )
    const groups = groupsSnap.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as HomeworkGroupDbModel[]

    if (groups.length === 0) {
      return { successful: 0, noSuccessful: 0, completed: 0, noCompleted: 0 }
    }

    const homeworksSnap = await getDocs(collection(this.firestore, 'homeworks'))
    const homeworks = homeworksSnap.docs
      .map(d => ({ id: d.id, ...d.data() }) as HomeworkDbModel)
      .filter(hw => groups.some(g => g.id === hw.group?.id))

    const answersSnap = await getDocs(
      query(
        collection(this.firestore, 'homework_answers'),
        where(
          'studentState',
          '==',
          doc(this.firestore, 'student_period_states', studentPeriodStateId)
        )
      )
    )

    const answers = answersSnap.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as HomeworkAnswerDbModel[]

    let successful = 0
    let noSuccessful = 0
    let completed = 0

    for (const hw of homeworks) {
      const answer = answers.find(a => a.homework.id === hw.id)

      if (answer) {
        completed++
        const selected = answer.content?.optionSelected?.id ?? null
        const correct = hw.content?.correctOption?.id ?? null

        if (selected && correct && selected === correct) {
          successful++
        } else {
          noSuccessful++
        }
      }
    }

    const noCompleted = homeworks.length - completed

    return { successful, noSuccessful, completed, noCompleted }
  }

  public generateId(): string {
    return doc(this.getCollectionRef()).id
  }

  private getCollectionRef() {
    return collection(this.firestore, this.collectionName)
  }

  public getRefById(id: string) {
    return doc(this.firestore, `${this.collectionName}/${id}`)
  }

  public static getCollectionRef(db: Firestore) {
    return collection(db, HomeworkRepository.collectionName)
  }

  public static getRefById(db: Firestore, id: string) {
    return doc(db, `${HomeworkRepository.collectionName}/${id}`)
  }
}
