import { Injectable, inject } from '@angular/core'
import {
  collection,
  DocumentReference,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  where,
  writeBatch
} from '@angular/fire/firestore'
import { from, map, Observable } from 'rxjs'
import { CreateHomeworkDb } from '../models/CreateHomeworkDb.model'
import { HomeworkDbModel } from '../models/HomeworkDb.model'
import { HomeworkGroupDbModel } from '../models/HomeworkGroupDb.model'
import { UpdateHomeworkDb } from '../models/UpdateHomeworkDb.model'
import { UpdateHomeworkParams } from '../models/UpdateHomeworkParams.model'
import { AnswerOptionRepository } from './answer-option.repository'
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

  public async getAllByHomeworkGroupIdAsync(
    homeworkGroupId: string
  ): Promise<HomeworkDbModel[]> {
    const homeworkGroupRef = HomeworkGroupRepository.getRefById(
      this.firestore,
      homeworkGroupId
    )
    const homeworksQuery = query(
      this.getCollectionRef(),
      where('group', '==', homeworkGroupRef)
    )

    const homeworksSnapshot = await getDocs(homeworksQuery)

    return homeworksSnapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() }) as HomeworkDbModel
    )
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

  public async existByIdAsync(id: string): Promise<boolean> {
    const homeworkRef = this.getRefById(id)
    const homeworkSnapshot = await getDoc(homeworkRef)
    return homeworkSnapshot.exists()
  }

  public async createById(
    id: string,
    homeworkGroup: HomeworkGroupDbModel,
    data: CreateHomeworkDb
  ): Promise<HomeworkDbModel> {
    const { content, groupId, ...homeworkData } = data

    const homeworkGroupRef = HomeworkGroupRepository.getRefById(
      this.firestore,
      groupId
    )

    const newHomeworkRef = doc(this.firestore, this.collectionName, id)

    const batch = writeBatch(this.firestore)

    const answerOptionsRefs: DocumentReference[] = []
    let correctOptionRef: DocumentReference | null = null

    for (const answerOption of content.options) {
      const answerOptionRef = AnswerOptionRepository.generateRef(this.firestore)

      batch.set(answerOptionRef, {
        answer: answerOption.answer,
        homework: newHomeworkRef
      })

      answerOptionsRefs.push(answerOptionRef)

      if (answerOption.answer === content.correctOption)
        correctOptionRef = answerOptionRef
    }

    batch.set(newHomeworkRef, {
      ...homeworkData,
      group: homeworkGroupRef,
      content: {
        correctOption: correctOptionRef,
        options: answerOptionsRefs
      }
    } as HomeworkDbModel)

    batch.update(homeworkGroupRef, {
      homeworks: [...homeworkGroup.homeworks, newHomeworkRef]
    })

    await batch.commit()

    const newHomeworkSnapshot = await getDoc(newHomeworkRef)

    return {
      id: newHomeworkSnapshot.id,
      ...newHomeworkSnapshot.data()
    } as HomeworkDbModel
  }

  public async updateById(
    id: string,
    data: Partial<UpdateHomeworkParams>
  ): Promise<void> {
    const homeworkRef = this.getRefById(id)

    const { content, image, ...updateData } = data

    const updateHomeworkData: Partial<UpdateHomeworkDb> = { ...updateData }

    const batch = writeBatch(this.firestore)

    if (image) updateHomeworkData.image = image

    if (content) {
      const homeworkAnswerOptionsQuery = query(
        AnswerOptionRepository.getCollectionRef(this.firestore),
        where('homework', '==', homeworkRef)
      )

      const homeworkAnswerOptionsSnapshot = await getDocs(
        homeworkAnswerOptionsQuery
      )

      const existingAnswerOptionsRefs: DocumentReference[] =
        homeworkAnswerOptionsSnapshot.docs.map(d => d.ref)

      const newAnswerOptionsRefs: DocumentReference[] = []
      let correctOptionRef: DocumentReference =
        AnswerOptionRepository.getRefById(this.firestore, content.correctOption)

      content.options.forEach(option => {
        if (option.id !== null) {
          const answerOptionRef = AnswerOptionRepository.getRefById(
            this.firestore,
            option.id
          )
          newAnswerOptionsRefs.push(answerOptionRef)

          return
        }

        const answerOptionRef = AnswerOptionRepository.generateRef(
          this.firestore
        )
        newAnswerOptionsRefs.push(answerOptionRef)

        batch.set(answerOptionRef, {
          answer: option.answer,
          homework: homeworkRef
        })

        if (
          option.id === content.correctOption ||
          option.answer === content.correctOption
        )
          correctOptionRef = answerOptionRef
      })

      existingAnswerOptionsRefs.forEach(ref => {
        if (!newAnswerOptionsRefs.some(newRef => newRef.path === ref.path)) {
          batch.delete(ref)
        }
      })

      updateHomeworkData.content = {
        correctOption: correctOptionRef,
        options: newAnswerOptionsRefs
      }
    }

    batch.update(homeworkRef, updateHomeworkData)

    await batch.commit()
  }

  public async deleteById(id: string): Promise<void> {
    const homeworkRef = this.getRefById(id)
    const homework = await this.getByIdAsync(id)

    if (homework === null) return

    const batch = writeBatch(this.firestore)

    homework.content.options.forEach(option => {
      batch.delete(option)
    })

    batch.delete(homeworkRef)

    await batch.commit()
  }

  public generateRef(): DocumentReference {
    return doc(this.getCollectionRef())
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
